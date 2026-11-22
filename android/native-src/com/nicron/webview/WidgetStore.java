package com.nicron.webview;

import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.res.Resources;
import android.widget.RemoteViews;

import org.json.JSONObject;

final class WidgetStore {
    private static final String PREFS = "foss_gym_widgets";
    private static final String SNAPSHOT = "snapshot";

    private WidgetStore() {}

    static void saveSnapshot(Context context, String json) {
        try {
            new JSONObject(json);
            preferences(context).edit().putString(SNAPSHOT, json).apply();
            refreshAll(context);
        } catch (Exception ignored) {
            // Ignore malformed bridge data and leave the last valid widget snapshot in place.
        }
    }

    static JSONObject snapshot(Context context) {
        try {
            return new JSONObject(preferences(context).getString(SNAPSHOT, "{}"));
        } catch (Exception ignored) {
            return new JSONObject();
        }
    }

    static SharedPreferences preferences(Context context) {
        return context.getSharedPreferences(PREFS, Context.MODE_PRIVATE);
    }

    static int resource(Context context, String type, String name) {
        Resources resources = context.getResources();
        return resources.getIdentifier(name, type, context.getPackageName());
    }

    static RemoteViews views(Context context, String layout) {
        return new RemoteViews(context.getPackageName(), resource(context, "layout", layout));
    }

    static void text(Context context, RemoteViews views, String id, String value) {
        views.setTextViewText(resource(context, "id", id), value == null ? "" : value);
    }

    static PendingIntent openApp(Context context, int requestCode) {
        Intent intent = new Intent(context, MainActivity.class);
        intent.setAction("com.foss.workouts.OPEN_WIDGET_" + requestCode);
        return PendingIntent.getActivity(
            context,
            requestCode,
            intent,
            PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );
    }

    static void openOnTap(Context context, RemoteViews views, int appWidgetId) {
        views.setOnClickPendingIntent(resource(context, "id", "widget_root"), openApp(context, appWidgetId));
    }

    static void refreshAll(Context context) {
        DashboardWidgetProvider.refresh(context);
        StatsWidgetProvider.refresh(context);
        BodyWidgetProvider.refresh(context);
        WorkoutWidgetProvider.refresh(context);
    }
}
