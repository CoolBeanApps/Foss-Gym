package com.nicron.webview;

import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.ComponentName;
import android.content.Context;
import android.widget.RemoteViews;

import org.json.JSONObject;

public class BodyWidgetProvider extends AppWidgetProvider {
    @Override
    public void onUpdate(Context context, AppWidgetManager manager, int[] appWidgetIds) {
        for (int appWidgetId : appWidgetIds) update(context, manager, appWidgetId);
    }

    static void refresh(Context context) {
        AppWidgetManager manager = AppWidgetManager.getInstance(context);
        int[] ids = manager.getAppWidgetIds(new ComponentName(context, BodyWidgetProvider.class));
        for (int id : ids) update(context, manager, id);
    }

    private static void update(Context context, AppWidgetManager manager, int appWidgetId) {
        JSONObject data = WidgetStore.snapshot(context);
        JSONObject body = data.optJSONObject("body");
        if (body == null) body = new JSONObject();
        RemoteViews views = WidgetStore.views(context, "widget_body");
        WidgetStore.text(context, views, "widget_title", data.optString("title", "Foss Gym") + " · BODY");
        WidgetStore.text(context, views, "widget_primary", body.optString("weight", "--"));
        WidgetStore.text(context, views, "widget_detail_one", "BMI  " + body.optString("bmi", "--"));
        WidgetStore.text(context, views, "widget_detail_two", "BODY FAT  " + body.optString("bodyFat", "--"));
        WidgetStore.openOnTap(context, views, appWidgetId);
        manager.updateAppWidget(appWidgetId, views);
    }
}
