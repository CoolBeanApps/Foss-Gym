package com.nicron.webview;

import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.ComponentName;
import android.content.Context;
import android.widget.RemoteViews;

import org.json.JSONObject;

public class DashboardWidgetProvider extends AppWidgetProvider {
    @Override
    public void onUpdate(Context context, AppWidgetManager manager, int[] appWidgetIds) {
        for (int appWidgetId : appWidgetIds) update(context, manager, appWidgetId);
    }

    static void refresh(Context context) {
        AppWidgetManager manager = AppWidgetManager.getInstance(context);
        int[] ids = manager.getAppWidgetIds(new ComponentName(context, DashboardWidgetProvider.class));
        for (int id : ids) update(context, manager, id);
    }

    private static void update(Context context, AppWidgetManager manager, int appWidgetId) {
        JSONObject data = WidgetStore.snapshot(context);
        RemoteViews views = WidgetStore.views(context, "widget_dashboard");
        WidgetStore.text(context, views, "widget_title", data.optString("title", "Foss Gym") + " · DASHBOARD");
        WidgetStore.text(context, views, "widget_primary", data.optString("rank", "--"));
        WidgetStore.text(context, views, "widget_secondary", data.optString("rankTitle", "Log a high score"));
        WidgetStore.text(context, views, "widget_detail_one", data.optString("points", "0 XP"));
        WidgetStore.text(context, views, "widget_detail_two", data.optString("coverage", "0 / 15 muscles tested"));
        WidgetStore.openOnTap(context, views, appWidgetId);
        manager.updateAppWidget(appWidgetId, views);
    }
}
