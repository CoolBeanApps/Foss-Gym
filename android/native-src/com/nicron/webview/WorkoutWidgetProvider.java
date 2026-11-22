package com.nicron.webview;

import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.widget.RemoteViews;

import org.json.JSONArray;
import org.json.JSONObject;

public class WorkoutWidgetProvider extends AppWidgetProvider {
    private static final String ACTION_NEXT = "com.foss.workouts.widget.NEXT_PLAN";
    private static final String EXTRA_ID = "widget_id";

    @Override
    public void onUpdate(Context context, AppWidgetManager manager, int[] appWidgetIds) {
        for (int appWidgetId : appWidgetIds) update(context, manager, appWidgetId);
    }

    @Override
    public void onReceive(Context context, Intent intent) {
        super.onReceive(context, intent);
        if (!ACTION_NEXT.equals(intent.getAction())) return;
        int appWidgetId = intent.getIntExtra(EXTRA_ID, AppWidgetManager.INVALID_APPWIDGET_ID);
        if (appWidgetId == AppWidgetManager.INVALID_APPWIDGET_ID) return;
        int next = WidgetStore.preferences(context).getInt(indexKey(appWidgetId), 0) + 1;
        WidgetStore.preferences(context).edit().putInt(indexKey(appWidgetId), next).apply();
        update(context, AppWidgetManager.getInstance(context), appWidgetId);
    }

    @Override
    public void onDeleted(Context context, int[] appWidgetIds) {
        for (int appWidgetId : appWidgetIds) {
            WidgetStore.preferences(context).edit().remove(indexKey(appWidgetId)).apply();
        }
        super.onDeleted(context, appWidgetIds);
    }

    static void refresh(Context context) {
        AppWidgetManager manager = AppWidgetManager.getInstance(context);
        int[] ids = manager.getAppWidgetIds(new ComponentName(context, WorkoutWidgetProvider.class));
        for (int id : ids) update(context, manager, id);
    }

    private static String indexKey(int appWidgetId) {
        return "plan_index_" + appWidgetId;
    }

    private static void update(Context context, AppWidgetManager manager, int appWidgetId) {
        JSONObject data = WidgetStore.snapshot(context);
        JSONArray plans = data.optJSONArray("plans");
        int count = plans == null ? 0 : plans.length();
        int stored = WidgetStore.preferences(context).getInt(indexKey(appWidgetId), 0);
        int index = count > 0 ? ((stored % count) + count) % count : 0;
        JSONObject plan = count > 0 ? plans.optJSONObject(index) : null;
        JSONArray exercises = plan == null ? null : plan.optJSONArray("exercises");
        RemoteViews views = WidgetStore.views(context, "widget_workout");
        WidgetStore.text(context, views, "widget_title", data.optString("title", "Foss Gym") + " · WORKOUT");
        WidgetStore.text(context, views, "widget_primary", plan == null ? "Build a workout plan" : plan.optString("name", "Workout"));
        for (int row = 0; row < 3; row++) {
            String exercise = exercises == null ? "" : exercises.optString(row, "");
            WidgetStore.text(context, views, "widget_row_" + (row + 1), exercise);
        }
        WidgetStore.text(context, views, "widget_action", count > 1 ? "Next plan  ›" : "Open Foss Gym  ›");
        if (count > 1) {
            Intent nextIntent = new Intent(context, WorkoutWidgetProvider.class);
            nextIntent.setAction(ACTION_NEXT);
            nextIntent.putExtra(EXTRA_ID, appWidgetId);
            PendingIntent nextPending = PendingIntent.getBroadcast(
                context,
                100000 + appWidgetId,
                nextIntent,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
            );
            views.setOnClickPendingIntent(WidgetStore.resource(context, "id", "widget_action"), nextPending);
        } else {
            views.setOnClickPendingIntent(WidgetStore.resource(context, "id", "widget_action"), WidgetStore.openApp(context, 100000 + appWidgetId));
        }
        WidgetStore.openOnTap(context, views, appWidgetId);
        manager.updateAppWidget(appWidgetId, views);
    }
}
