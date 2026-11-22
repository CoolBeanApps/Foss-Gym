package com.nicron.webview;

import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.ComponentName;
import android.content.Context;
import android.widget.RemoteViews;

import org.json.JSONArray;
import org.json.JSONObject;

public class StatsWidgetProvider extends AppWidgetProvider {
    @Override
    public void onUpdate(Context context, AppWidgetManager manager, int[] appWidgetIds) {
        for (int appWidgetId : appWidgetIds) update(context, manager, appWidgetId);
    }

    static void refresh(Context context) {
        AppWidgetManager manager = AppWidgetManager.getInstance(context);
        int[] ids = manager.getAppWidgetIds(new ComponentName(context, StatsWidgetProvider.class));
        for (int id : ids) update(context, manager, id);
    }

    private static void update(Context context, AppWidgetManager manager, int appWidgetId) {
        JSONObject data = WidgetStore.snapshot(context);
        JSONArray scores = data.optJSONArray("topScores");
        RemoteViews views = WidgetStore.views(context, "widget_stats");
        WidgetStore.text(context, views, "widget_title", data.optString("title", "Foss Gym") + " · TOP STATS");
        for (int index = 0; index < 3; index++) {
            JSONObject score = scores == null ? null : scores.optJSONObject(index);
            String row = score == null
                ? (index == 0 ? "Save a score to fill this widget" : "")
                : score.optString("name", "Exercise") + "  " + score.optString("value", "") + "  ·  " + score.optString("rank", "");
            WidgetStore.text(context, views, "widget_row_" + (index + 1), row);
        }
        WidgetStore.openOnTap(context, views, appWidgetId);
        manager.updateAppWidget(appWidgetId, views);
    }
}
