# When to Restart vs. Stop and Start Linux Apps on Azure
*November 26, 2024*
*Jay*

Azure App Service and Azure Container Apps have different lifecycle controls. A restart is useful for transient runtime failures. Stopping and starting is a broader availability action, not a substitute for diagnosing the underlying problem or deploying a new image.

Before taking either action, capture logs, metrics, and recent configuration or deployment changes. Restarting first can erase the evidence needed for root-cause analysis.

## Azure App Service on Linux

### When to Restart

Restart the app when you need to recycle its worker processes across the instances serving it. This can temporarily recover from a stuck process, exhausted in-memory state, or a transient runtime failure.

Examples include:

- A process is unresponsive after you have captured diagnostics.
- Memory usage remains elevated because of an application leak.
- A dependency experienced a transient failure and the application did not recover correctly.

Many App Service configuration changes already trigger an application restart. A deployment should use the supported deployment flow rather than relying on a manual restart to apply code.

### When to Stop and Start

Stopping an App Service app takes it offline until it is started again. Use this when you intentionally need the application unavailable, such as during controlled maintenance or when preventing traffic and compute activity while investigating an incident.

Do not assume stop/start will fix DNS, TLS, disk, or application defects. Diagnose those problems directly. For production maintenance, use deployment slots or another traffic-management strategy when possible to reduce downtime.

## Azure Container Apps

Azure Container Apps manages immutable revisions and their replicas. Its lifecycle differs from App Service.

### When to Restart a Revision

Restart a revision when its replicas are in a bad transient state and you want Azure to create new replicas for that revision. Capture console and system logs first. If the failure is caused by code, configuration, secrets, or the container image, create a corrected revision instead of repeatedly restarting the old one.

### When to Stop and Start the App

Stopping a container app disables all of its revisions and stops accepting traffic. Starting it makes the app active again. Use this for intentional shutdowns, maintenance, or cost control when downtime is acceptable.

Stop/start does not deploy a new image. To update an image or revision-scope configuration, update the container app so Azure creates a new revision, then direct traffic to the healthy revision.

## Quick Reference

| Scenario | Azure App Service on Linux | Azure Container Apps |
|---|---|---|
| Transient stuck process or replica | Restart after collecting diagnostics | Restart the affected revision after collecting diagnostics |
| Code, image, or configuration defect | Correct and redeploy | Create a corrected revision and shift traffic |
| Planned downtime | Stop and start the app | Stop and start the container app |
| New container image | Deploy through App Service | Update the app to create a new revision |
| Repeated memory, disk, DNS, or TLS failure | Diagnose the root cause; a restart is temporary | Diagnose the root cause; a restart is temporary |

Restarts are recovery actions, not fixes. If the same symptom returns, use logs, metrics, Health Check, Application Insights, and revision diagnostics to identify the underlying cause.

## Sources

- [Azure CLI: Restart an App Service Web App](https://learn.microsoft.com/en-us/cli/azure/webapp?view=azure-cli-latest#az-webapp-restart)
- [Azure App Service Diagnostics Overview](https://learn.microsoft.com/en-us/azure/app-service/overview-diagnostics)
- [Azure CLI: Stop and Start a Container App](https://learn.microsoft.com/en-us/cli/azure/containerapp?view=azure-cli-latest#az-containerapp-stop)
- [Update and Deploy Changes in Azure Container Apps](https://learn.microsoft.com/en-us/azure/container-apps/revisions-manage)
- [Troubleshoot Health and Performance in Azure Container Apps](https://learn.microsoft.com/en-us/azure/container-apps/troubleshooting)