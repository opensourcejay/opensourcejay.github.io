# When to restart vs stop start linux and container apps on Azure
*November 26, 2024*
*Jay*

![Deploying Apps to Azure App Service Using Oryx](/images/blog/when_to_restart_vs_stop_start_linux_and_container_apps_on_azure.png)

# Azure App Service Troubleshooting: When to Restart vs. Stop/Start for Linux Web Apps and Container Apps

In Azure App Service, understanding when to use restart vs. stop/start is critical for efficient troubleshooting. Each option has specific use cases, and they differ especially when dealing with containerized apps. Let’s explore real-world examples with more detailed descriptions for when to use each action.

## For Linux Web Apps:
### When to Restart:
**Restart:** This resets the application process without affecting the entire environment, making it a fast solution for smaller, app-specific issues.

Performance Degradation (Memory/CPU Spikes): If your app is slowing down due to high memory usage or CPU spikes, restarting clears in-memory data and CPU-heavy processes without interrupting the app environment.

- Example: Your Node.js app has a memory leak due to a background job that didn't clear properly. A restart resets the job, clears memory, and prevents the app from crashing under high memory use.

Applying Minor Configuration Changes: After modifying environment variables or other application settings (e.g., API keys or database connection strings), restarting ensures the app picks up the new settings.

- Example: You change the database connection string for your Flask app. Restarting the app will reload the new configuration, allowing it to connect to the updated database without tearing down the container.

Minor Code Updates: After pushing small bug fixes or deploying a patch, restart the app to ensure the code is applied without needing a full reset.

- Example: You fix a broken route in a Django app, and restarting applies the fix while keeping the app environment stable.

**Stop/Start:** This is a more aggressive reset, taking the entire app offline and restarting it, including its infrastructure and resources.
When to Stop/Start:

### When to Stop & Start:

Resource Exhaustion (Disk or Memory): When logs, temp files, or processes are eating up too much disk space or memory, a stop/start clears all system resources and resets the environment completely.

- Example: Your PHP web app has been writing excessive logs and is running out of disk space. A stop/start clears the container, wipes non-persistent logs, and starts with a fresh slate.

Persistent Network Issues: If your app is facing continuous SSL certificate errors or DNS resolution failures, stop/start resets the network stack, which can help re-establish connections.

- Example: Your app can’t connect to an external API due to SSL handshake failures. A stop/start resets the network configuration and re-establishes secure connections.

Major Infrastructure Changes: When moving to a new App Service Plan or scaling up your infrastructure, a stop/start ensures that the new environment configurations are fully applied.

- Example: You switch your app to a larger service plan for better performance under high traffic. A stop/start ensures that the app is running on the new, scaled infrastructure with the right resource allocation.

## For Container Apps:

### When to Restart:
**Restart:** This action only restarts the application process inside the existing container. The container remains intact, and no changes are made to the container image or its environment.

Application Crashes or Logic Failures: If your app crashes due to code logic errors or runtime exceptions, restarting the app inside the container can quickly resolve the issue.

- Example: A Spring Boot app crashes after a failed HTTP request. Restarting resets the app and avoids tearing down the container, which means you can resolve the issue without affecting other running services.

Configuration or Environment Variable Changes: If you've updated environment variables inside the container (e.g., modifying API endpoints or secrets), a restart is enough to reload the new settings.

- Example: You update an API key stored in the environment variables for your Express.js app. Restarting the container applies the updated environment configuration without needing to pull a new Docker image.

**Stop/Start:** This is a complete teardown of the container, including pulling new Docker images and reinitializing network and file systems. It's used when deeper issues need a full reset or when you're updating the container image.

### When to Stop & Start:

- Deploying a New Docker Image: If you've pushed a new Docker image (e.g., new app version or runtime updates), stop/start is necessary to pull the latest image and apply the changes.

Example: You update your Dockerfile to switch from Node.js 14 to Node.js 18. A stop/start ensures the container runs the new image with the updated runtime.

- Container-Level Resource Exhaustion: If your container is maxing out memory or disk space due to excessive logging or failed processes, stop/start clears all non-persistent data and resets system resources.

Example: Your Redis-backed Node.js container is running out of memory because too many logs have accumulated. A stop/start resets the container and clears the excessive logs and temporary files.

- Persistent Networking Failures: If SSL, DNS, or external connection issues persist even after a restart, stop/start resets the entire network stack, re-establishing all connections.

Example: Your Flask app can't connect to a remote SQL database due to persistent DNS resolution errors. A stop/start resolves the DNS issues by resetting the container's network configuration.

## More Detailed Examples for Each Case:
### For Linux Web Apps:

**Example 1**: Imagine your Flask app is running fine until suddenly, high traffic causes it to crash. Upon investigation, you see that a memory leak caused the app to consume excessive RAM. In this case, a restart quickly refreshes the app process without disrupting the entire environment.

**Example 2:** Your PHP app is failing to connect to an updated external API because the connection string was changed. After updating the environment variables in the Azure portal, a restart will pick up the new configuration and reconnect to the external service.

### For Container Apps:

**Example 1:** You've deployed a new Django app using an older Python base image, and now need to switch to a newer version of Python. You update your Dockerfile, push the new image, and run a stop/start to pull the updated image and rebuild the container environment.

**Example 2:** Your Go app inside a container has run out of disk space due to excessive log generation. To fix it, you perform a stop/start, which resets the container, clears logs, and reinitializes the app with a clean file system.

| Scenario                             | Linux Web App (Restart/Stop) | Container App (Restart/Stop)                         |
|--------------------------------------|-----------------------------|-----------------------------------------------------|
| High memory/CPU usage                | Restart                     | Restart                                             |
| Persistent network/SSL issues        | Stop/Start                  | Stop/Start                                          |
| Minor configuration changes          | Restart                     | Restart                                             |
| Deploying new code (minor updates)   | Restart                     | Restart (no new image); Stop/Start (new image)      |
| Disk/resource exhaustion             | Stop/Start                  | Stop/Start                                          |
| Major infrastructure changes         | Stop/Start                  | Stop/Start                                          |

By understanding these scenarios and knowing when to choose restart versus stop/start, you can minimize downtime, resolve issues quickly, and keep your apps running smoothly in Azure.