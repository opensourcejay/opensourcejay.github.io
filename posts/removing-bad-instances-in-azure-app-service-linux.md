# Removing and Automating Bad Instances in Azure App Service Linux
*November 24, 2024*
*Jay*

Managing unhealthy instances in Azure App Service (Linux) involves identifying, rebooting, or automating the removal of problematic instances. This guide will help you manage unhealthy instances manually and leverage Azure’s automation features to maintain your app’s availability and performance.

## Identifying the Problem
To determine which instance is unhealthy, use App Service Health Check and Azure monitoring:

- Navigate to **Monitoring > Health check** in the Azure portal.
- Define an endpoint such as `/health` that verifies the app's critical dependencies and returns an HTTP status code from 200 through 299 only when the instance is healthy.
- Review Health Check status, metrics, logs, and Application Insights telemetry to identify failures tied to a particular instance.

## Rebooting or Removing Unhealthy Instances
When Health Check is enabled, App Service removes an instance from the load balancer after the configured number of failed checks. If the instance remains unhealthy, App Service can replace it according to the platform's Health Check behavior.

For an immediate targeted recovery:

- Open **Diagnose and solve problems** for the app.
- Use the availability and performance diagnostics to confirm the affected instance.
- Use the platform's advanced application restart tooling when a specific worker must be restarted, or restart the whole app when all instances are affected.

Do not scale down solely to remove a specific worker. Scaling down does not guarantee which instance Azure removes, and reducing capacity can affect availability.

## Monitoring with Application Insights and Alerts
Application Insights is a powerful tool that helps track key metrics like request failures, response times, and server exceptions. Here's how to set it up:

### Enable Application Insights

- In your Web App's Monitoring section, enable Application Insights.

### Set Alerts

- Go to **Azure Monitor > Alerts**.
- Create an alert rule based on a metric, such as elevated response time or HTTP 5xx responses.
- Define an action group for email, SMS, webhook, or another supported notification channel.

### Create Dashboards

Set up dashboards to visualize CPU usage, memory, response time, and error rates so recurring issues are easier to detect.

## Automating the Handling of Unhealthy Instances
Auto-Healing automates the recovery of your app when it encounters issues such as slow responses or high memory usage. Here’s how to set it up:

- Go to **Diagnose and solve problems > Auto-Heal**.
- Define rules based on triggers such as slow requests, memory usage, request counts, or specific HTTP status codes.
- Once configured, Auto-Heal can take a recovery action when a rule is triggered.

Proactive Auto-Heal is enabled by default and can restart workers when App Service detects supported memory or request-duration conditions. Review its behavior before disabling it or adding overlapping custom rules.

## Best Practices

- **Use Health Check:** Detect unhealthy instances early and remove them from load balancing.
- **Design a meaningful health endpoint:** Check critical dependencies without making the endpoint slow or fragile.
- **Use Auto-Heal carefully:** Configure recovery rules for known failure patterns and avoid restart loops.
- **Enable alerts:** Notify operators about performance issues and potential downtime.
- **Monitor recovery actions:** Use Azure Monitor and Log Analytics to track when Health Check or Auto-Heal intervenes.

Combining these practices will help you maintain smooth operations and reduce the need for manual intervention, even during peak loads or unforeseen issues.

## Sources

- [Monitor App Service Instances Using Health Check](https://learn.microsoft.com/en-us/azure/app-service/monitor-instances-health-check)
- [Azure App Service Diagnostics Overview](https://learn.microsoft.com/en-us/azure/app-service/overview-diagnostics)
- [Monitor Azure App Service](https://learn.microsoft.com/en-us/azure/app-service/monitor-app-service)
- [Application Insights Overview](https://learn.microsoft.com/en-us/azure/azure-monitor/app/app-insights-overview)