# Removing and Automating Bad Instances in Azure App Service Linux
*November 24, 2024*
*Jay*


![Removing and Automating Bad Instances in Azure App Service](/images/blog/removing-bad-instances-in-azure-app-service-linux.png)

Managing unhealthy instances in Azure App Service (Linux) involves identifying, rebooting, or automating the removal of problematic instances. This guide will help you manage unhealthy instances manually and leverage Azure’s automation features to maintain your app’s availability and performance.

## Identifying the Problem
To determine which instance is unhealthy, you can use Health Checks:

* Navigate to **Settings > Health Check** in the Azure Portal.
* Define a custom endpoint (e.g., /health) to check if instances are responding correctly.
* Monitor the status of instances in the Instances tab, which will flag unhealthy instances.

## Rebooting or Removing Unhealthy Instances
Once an instance is identified as unhealthy, you can reboot or remove it:

**Reboot the Instance:**

* Go to the Instances tab in your Web App in Azure Portal.
* Locate the unhealthy instance and hit Restart to reboot it.
* Remove the Instance via Scaling:

Go to Scale Out (App Service Plan) in the Azure Portal.

Temporarily scale down to 1 instance, which will remove the bad instance.
After a few minutes, scale back up to 2 instances. Azure will create a fresh instance to replace the unhealthy one.

## Monitoring with Application Insights and Alerts
Application Insights is a powerful tool that helps track key metrics like request failures, response times, and server exceptions. Here's how to set it up:

**Enable Application Insights:**

* In your Web App’s Monitoring section, enable Application Insights.

**Set Alerts:**
* Go to Azure Monitor > Alerts.
* Create a new alert rule based on a metric, such as response times exceeding 2 seconds or a high error rate.
* Define Action Groups to notify you via email, SMS, or integration with tools like Slack.
Custom Dashboards:

Set up custom dashboards to visualize the performance of your app, tracking key metrics such as CPU usage, memory, and error rates, allowing you to proactively detect any recurring issues.

## Automating the Handling of Unhealthy Instances
Auto-Healing automates the recovery of your app when it encounters issues such as slow responses or high memory usage. Here’s how to set it up:

* Go to Diagnose and Solve Problems > Auto-Heal.
* Define custom rules based on triggers like slow requests, high memory usage, or specific HTTP status codes. For example, you can configure it to recycle the app if response times exceed a certain threshold or if too many 500 errors occur.
* Once configured, Auto-Heal will automatically restart or recycle unhealthy instances to maintain your app's stability.

For further automation, use Proactive Auto-Heal, which automatically restarts instances when memory leaks or slow responses are detected​


## Best Practices
* Leverage Health Checks: Set up health checks to proactively detect unhealthy instances early.
* Use Auto-Healing: Configure custom auto-heal rules to automatically restart or recycle bad instances.
* Enable Alerts: Set up alerts in Application Insights to stay informed of performance issues and potential downtime before they affect users.
* Monitor with Azure Monitor: Use Log Analytics to track when auto-healing actions are triggered, and set up alerts to notify you when these events occur​
AZURE

## Conclusion
Azure App Service (Linux) provides several robust tools to identify, resolve, and automate the management of unhealthy instances. 

Leveraging Health Checks, Auto-Heal, and Application Insights, you can ensure your application remains stable, responsive, and highly available, even during peak loads or unforeseen issues. 

These best practices will help you maintain smooth operations while reducing the need for manual interventions.