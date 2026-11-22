package com.nicron.webview;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.Manifest;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.os.SystemClock;
import android.os.VibrationEffect;
import android.os.Vibrator;
import android.util.Base64;
import android.webkit.JavascriptInterface;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;

public class MainActivity extends Activity {
    private static final int CREATE_CSV_REQUEST = 5101;
    private static final int OPEN_CSV_REQUEST = 5102;
    private static final int NOTIFICATION_PERMISSION_REQUEST = 5103;
    private static final int TIMER_NOTIFICATION_ID = 5201;
    private static final String TIMER_CHANNEL_ID = "foss_gym_cooldown";
    private static final String ACTION_RESET_TIMER = "com.foss.workouts.RESET_COOLDOWN";
    private static final String DONATE_ONE_TIME_URL = "https://donate.stripe.com/7sYdR97FE4dK4IJdxqf7i06";
    private static final String DONATE_MONTHLY_050_URL = "https://buy.stripe.com/9B6eVd9NM4dKgrr8d6f7i07";
    private static final String DONATE_MONTHLY_075_URL = "https://donate.stripe.com/eVq4gz5xw4dK3EF792f7i08";
    private static final String DONATE_MONTHLY_100_URL = "https://donate.stripe.com/bJedR94tsaC82AB792f7i09";
    private static final String DONATE_MONTHLY_300_URL = "https://donate.stripe.com/28E7sLgcaaC8ejjgJCf7i0a";
    private static final String DONATE_MONTHLY_500_URL = "https://donate.stripe.com/dRmaEXcZY8u02ABctmf7i0b";

    private WebView webView;
    private String pendingCsv = "";
    private final Handler timerHandler = new Handler(Looper.getMainLooper());
    private volatile int timerDurationSeconds = 60;
    private volatile int timerRemainingSeconds = 60;
    private volatile boolean timerRunning = false;
    private long timerEndsAtElapsed = 0L;

    private final Runnable timerTick = new Runnable() {
        @Override
        public void run() {
            if (!timerRunning) return;
            int remaining = Math.max(0, (int) Math.ceil((timerEndsAtElapsed - SystemClock.elapsedRealtime()) / 1000.0));
            timerRemainingSeconds = remaining;
            if (remaining <= 0) {
                timerRunning = false;
                postTimerNotification(0, false, true);
                vibrateCooldownComplete();
                evaluateTimerState();
                return;
            }
            postTimerNotification(remaining, true, false);
            evaluateTimerState();
            timerHandler.postDelayed(this, 500L);
        }
    };

    @SuppressLint({"SetJavaScriptEnabled", "JavascriptInterface"})
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        setTheme(android.R.style.Theme_Material_NoActionBar);
        super.onCreate(savedInstanceState);
        requestWindowFeature(1);

        webView = new WebView(this);
        setContentView(webView);

        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setAllowFileAccess(true);
        settings.setAllowContentAccess(true);
        settings.setMediaPlaybackRequiresUserGesture(false);
        settings.setCacheMode(WebSettings.LOAD_DEFAULT);
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);

        webView.setWebViewClient(new WebViewClient());
        webView.setWebChromeClient(new WebChromeClient());
        webView.addJavascriptInterface(new FossFileBridge(), "FossFiles");
        webView.addJavascriptInterface(new FossWidgetBridge(), "FossWidgets");
        webView.addJavascriptInterface(new FossTimerBridge(), "FossTimer");
        webView.addJavascriptInterface(new FossLinkBridge(), "FossLinks");
        createTimerNotificationChannel();
        webView.loadUrl("file:///android_asset/index.html");
        handleTimerIntent(getIntent());
    }

    public final class FossWidgetBridge {
        @JavascriptInterface
        public void updateSnapshot(String json) {
            WidgetStore.saveSnapshot(MainActivity.this, json == null ? "{}" : json);
        }
    }

    public final class FossFileBridge {
        @JavascriptInterface
        public void exportCsv(final String fileName, final String csv) {
            runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    pendingCsv = csv == null ? "" : csv;
                    Intent intent = new Intent(Intent.ACTION_CREATE_DOCUMENT);
                    intent.addCategory(Intent.CATEGORY_OPENABLE);
                    intent.setType("text/csv");
                    intent.putExtra(Intent.EXTRA_TITLE, safeFileName(fileName));
                    startActivityForResult(intent, CREATE_CSV_REQUEST);
                }
            });
        }

        @JavascriptInterface
        public void importCsv() {
            runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    Intent intent = new Intent(Intent.ACTION_OPEN_DOCUMENT);
                    intent.addCategory(Intent.CATEGORY_OPENABLE);
                    intent.setType("text/*");
                    startActivityForResult(intent, OPEN_CSV_REQUEST);
                }
            });
        }
    }

    public final class FossTimerBridge {
        @JavascriptInterface
        public void start(final int seconds) {
            runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    startCooldownTimer(seconds);
                }
            });
        }

        @JavascriptInterface
        public void stop(final int seconds) {
            runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    stopCooldownTimer(seconds);
                }
            });
        }

        @JavascriptInterface
        public int remainingSeconds() {
            return timerRemainingSeconds;
        }

        @JavascriptInterface
        public int durationSeconds() {
            return timerDurationSeconds;
        }

        @JavascriptInterface
        public boolean isRunning() {
            return timerRunning;
        }
    }

    public final class FossLinkBridge {
        @JavascriptInterface
        public void openDonatePage() {
            openDonation("one_time");
        }

        @JavascriptInterface
        public void openDonation(final String option) {
            runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    try {
                        startActivity(new Intent(Intent.ACTION_VIEW, Uri.parse(donationUrl(option))));
                    } catch (Exception ignored) {}
                }
            });
        }
    }

    private String donationUrl(String option) {
        if ("monthly_050".equals(option)) return DONATE_MONTHLY_050_URL;
        if ("monthly_075".equals(option)) return DONATE_MONTHLY_075_URL;
        if ("monthly_100".equals(option)) return DONATE_MONTHLY_100_URL;
        if ("monthly_300".equals(option)) return DONATE_MONTHLY_300_URL;
        if ("monthly_500".equals(option)) return DONATE_MONTHLY_500_URL;
        return DONATE_ONE_TIME_URL;
    }

    private int cleanTimerSeconds(int seconds) {
        if (seconds <= 45) return 30;
        if (seconds <= 75) return 60;
        return 90;
    }

    private void startCooldownTimer(int seconds) {
        timerDurationSeconds = cleanTimerSeconds(seconds);
        timerRemainingSeconds = timerDurationSeconds;
        timerEndsAtElapsed = SystemClock.elapsedRealtime() + timerDurationSeconds * 1000L;
        timerRunning = true;
        timerHandler.removeCallbacks(timerTick);
        requestTimerNotificationPermissionIfNeeded();
        postTimerNotification(timerRemainingSeconds, true, false);
        evaluateTimerState();
        timerHandler.postDelayed(timerTick, 250L);
    }

    private void stopCooldownTimer(int seconds) {
        timerDurationSeconds = cleanTimerSeconds(seconds);
        timerRemainingSeconds = timerDurationSeconds;
        timerRunning = false;
        timerEndsAtElapsed = 0L;
        timerHandler.removeCallbacks(timerTick);
        NotificationManager manager = (NotificationManager) getSystemService(NOTIFICATION_SERVICE);
        if (manager != null) manager.cancel(TIMER_NOTIFICATION_ID);
        evaluateTimerState();
    }

    private void restartCooldownFromLockScreen() {
        startCooldownTimer(timerDurationSeconds);
    }

    private void evaluateTimerState() {
        evaluate("window.FossGymTimer && window.FossGymTimer.nativeTick(" + timerRemainingSeconds + "," + timerRunning + ");");
    }

    private void handleTimerIntent(Intent intent) {
        if (intent != null && ACTION_RESET_TIMER.equals(intent.getAction())) {
            restartCooldownFromLockScreen();
            intent.setAction(null);
        }
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent);
        handleTimerIntent(intent);
    }

    private void createTimerNotificationChannel() {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) return;
        NotificationManager manager = (NotificationManager) getSystemService(NOTIFICATION_SERVICE);
        if (manager == null) return;
        NotificationChannel channel = new NotificationChannel(
            TIMER_CHANNEL_ID,
            "Cooldown timer",
            NotificationManager.IMPORTANCE_LOW
        );
        channel.setDescription("Shows the active Foss Gym cooldown with a lock-screen reset control.");
        channel.enableVibration(false);
        channel.setSound(null, null);
        channel.setLockscreenVisibility(Notification.VISIBILITY_PUBLIC);
        manager.createNotificationChannel(channel);
    }

    private boolean canPostTimerNotification() {
        return Build.VERSION.SDK_INT < 33 || checkSelfPermission(Manifest.permission.POST_NOTIFICATIONS) == PackageManager.PERMISSION_GRANTED;
    }

    private void requestTimerNotificationPermissionIfNeeded() {
        if (Build.VERSION.SDK_INT >= 33 && checkSelfPermission(Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED) {
            requestPermissions(new String[]{Manifest.permission.POST_NOTIFICATIONS}, NOTIFICATION_PERMISSION_REQUEST);
        }
    }

    private PendingIntent timerContentIntent() {
        Intent open = new Intent(this, MainActivity.class);
        open.addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP | Intent.FLAG_ACTIVITY_CLEAR_TOP);
        int flags = PendingIntent.FLAG_UPDATE_CURRENT;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) flags |= PendingIntent.FLAG_IMMUTABLE;
        return PendingIntent.getActivity(this, 5202, open, flags);
    }

    private PendingIntent timerResetIntent() {
        Intent reset = new Intent(this, MainActivity.class);
        reset.setAction(ACTION_RESET_TIMER);
        reset.addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP | Intent.FLAG_ACTIVITY_CLEAR_TOP);
        int flags = PendingIntent.FLAG_UPDATE_CURRENT;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) flags |= PendingIntent.FLAG_IMMUTABLE;
        return PendingIntent.getActivity(this, 5203, reset, flags);
    }

    private void postTimerNotification(int remaining, boolean running, boolean completed) {
        if (!canPostTimerNotification()) return;
        NotificationManager manager = (NotificationManager) getSystemService(NOTIFICATION_SERVICE);
        if (manager == null) return;
        Notification.Builder builder = Build.VERSION.SDK_INT >= Build.VERSION_CODES.O
            ? new Notification.Builder(this, TIMER_CHANNEL_ID)
            : new Notification.Builder(this);
        int icon = getApplicationInfo().icon;
        if (icon == 0) icon = android.R.drawable.ic_lock_idle_alarm;
        builder.setSmallIcon(icon)
            .setContentTitle(completed ? "Cooldown complete" : "Foss Gym cooldown")
            .setContentText(completed ? "Reset for another " + timerDurationSeconds + " seconds" : remaining + " seconds remaining")
            .setContentIntent(timerContentIntent())
            .setVisibility(Notification.VISIBILITY_PUBLIC)
            .setCategory(Notification.CATEGORY_ALARM)
            .setOnlyAlertOnce(true)
            .setOngoing(running)
            .setAutoCancel(false)
            .addAction(android.R.drawable.ic_popup_sync, "Reset", timerResetIntent());
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) builder.setPriority(Notification.PRIORITY_LOW);
        if (running) {
            builder.setWhen(System.currentTimeMillis() + remaining * 1000L).setUsesChronometer(true).setShowWhen(true);
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) builder.setChronometerCountDown(true);
        } else {
            builder.setWhen(System.currentTimeMillis()).setUsesChronometer(false).setShowWhen(true);
        }
        manager.notify(TIMER_NOTIFICATION_ID, builder.build());
    }

    private void vibrateCooldownComplete() {
        Vibrator vibrator = (Vibrator) getSystemService(VIBRATOR_SERVICE);
        if (vibrator == null || !vibrator.hasVibrator()) return;
        long[] pattern = new long[]{0L, 180L, 120L, 180L, 120L, 180L};
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            vibrator.vibrate(VibrationEffect.createWaveform(pattern, -1));
        } else {
            vibrator.vibrate(pattern, -1);
        }
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (requestCode == NOTIFICATION_PERMISSION_REQUEST && timerRunning && grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
            postTimerNotification(timerRemainingSeconds, true, false);
        }
    }

    private String safeFileName(String requested) {
        String name = requested == null ? "" : requested.trim();
        if (name.length() == 0) name = "Foss-Gym-Backup.csv";
        if (!name.toLowerCase().endsWith(".csv")) name += ".csv";
        return name.replaceAll("[^A-Za-z0-9._-]", "-");
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (resultCode != RESULT_OK || data == null || data.getData() == null) return;

        Uri uri = data.getData();
        if (requestCode == CREATE_CSV_REQUEST) {
            writeCsv(uri);
        } else if (requestCode == OPEN_CSV_REQUEST) {
            readCsv(uri);
        }
    }

    private void writeCsv(Uri uri) {
        boolean success = false;
        try (OutputStream output = getContentResolver().openOutputStream(uri)) {
            if (output != null) {
                output.write(pendingCsv.getBytes(StandardCharsets.UTF_8));
                output.flush();
                success = true;
            }
        } catch (Exception ignored) {
            success = false;
        }
        pendingCsv = "";
        evaluate("window.fossNativeExportFinished && window.fossNativeExportFinished(" + success + ");");
    }

    private void readCsv(Uri uri) {
        try (InputStream input = getContentResolver().openInputStream(uri);
             ByteArrayOutputStream output = new ByteArrayOutputStream()) {
            if (input == null) throw new IllegalStateException("Could not open file");
            byte[] buffer = new byte[8192];
            int count;
            int total = 0;
            while ((count = input.read(buffer)) != -1) {
                total += count;
                if (total > 5 * 1024 * 1024) throw new IllegalStateException("Backup is too large");
                output.write(buffer, 0, count);
            }
            String encoded = Base64.encodeToString(output.toByteArray(), Base64.NO_WRAP);
            evaluate("window.receiveFossCsvBase64 && window.receiveFossCsvBase64('" + encoded + "');");
        } catch (Exception ignored) {
            evaluate("window.receiveFossCsvBase64 && window.receiveFossCsvBase64('');");
        }
    }

    private void evaluate(final String script) {
        if (webView == null) return;
        webView.post(new Runnable() {
            @Override
            public void run() {
                webView.evaluateJavascript(script, null);
            }
        });
    }

    @Override
    public void onBackPressed() {
        if (webView != null && webView.canGoBack()) webView.goBack();
        else super.onBackPressed();
    }

    @Override
    protected void onDestroy() {
        timerHandler.removeCallbacks(timerTick);
        if (webView != null) {
            webView.destroy();
            webView = null;
        }
        super.onDestroy();
    }
}
