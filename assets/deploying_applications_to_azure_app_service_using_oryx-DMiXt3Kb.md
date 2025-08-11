# Deploying applications to Azure App Service using Oryx
*August 16, 2024*
*Jay*

![Deploying Apps to Azure App Service Using Oryx](/images/blog/deploying_applications_to_azure_app_service_using_oryx.png)

Oryx is an open-source build system developed by Microsoft that plays a crucial role in automating the deployment process for applications on Azure App Service. The main goal of Oryx is to simplify and standardize the deployment process across various programming languages.

# Oryx: Open-Source Build System for Azure

## 1. What is Oryx?

**Oryx** is an open-source build system developed by Microsoft that plays a crucial role in automating the deployment process for applications on Azure App Service. The main goal of Oryx is to simplify and standardize the deployment process across various programming languages.

<!--truncate-->

It automatically detects the language used in your project, installs the necessary dependencies, builds the application, and configures the runtime environment to ensure your application runs efficiently on Azure.

---

## 2. Supported Languages

Oryx supports a wide range of programming languages and environments, making it versatile for different types of web applications. The supported languages include:

**Node.js** – Commonly used for server-side JavaScript applications.  
**Python** – Popular for web frameworks like Django and Flask.  
**.NET Core** – For cross-platform applications developed in C#.  
**PHP** – Used for content management systems like WordPress and Laravel applications.  
**Ruby** – For web applications built with Ruby on Rails.  
**Java** – Often used with Spring Boot or other enterprise Java applications.  
**Go** – Ideal for high-performance, statically typed applications.  
**Static HTML and JavaScript apps** – For front-end applications that don’t require server-side logic.  

---

## 3. How Oryx Works in Azure App Service

### Step 1: Language Detection

When you deploy your application to Azure App Service, Oryx begins by detecting the programming language used in your project. This is done by scanning for specific files that are unique to each language. For example:

**Node.js** – Detects `package.json` (includes dependencies, scripts, and version info).  
**Python** – Looks for `requirements.txt` or `pyproject.toml`.  
**.NET Core** – Identifies `.csproj` or `.fsproj`.  
**PHP** – Detects `composer.json` (manages PHP dependencies).  
**Ruby** – Looks for `Gemfile` (lists Ruby gems).  
**Java** – Identifies `pom.xml` or `build.gradle`.  
**Go** – Detects `go.mod` (defines module path and dependencies).  
**Static HTML** – Detects the presence of HTML files and static assets.  

### Step 2: Build Process

After detecting the language, Oryx proceeds to the build phase, which includes:

#### **Dependency Installation**
Oryx installs all necessary dependencies using language-specific commands:

**Node.js** → `npm install` or `yarn install`  
**Python** → `pip install -r requirements.txt`  
**.NET Core** → `dotnet restore`  
**PHP** → `composer install`  
**Ruby** → `bundle install`  
**Java** → `mvn install` (Maven) or `gradle build` (Gradle)  
**Go** → `go build`  

#### **Compilation and Build**
Depending on the language, Oryx compiles the source code:

**Java** → `.jar` or `.war` via Maven/Gradle.  
**.NET Core** → Compiled into binaries using `dotnet build`.  
**Go** → Compiled into a single binary executable.  
**Node.js/Python** → Bundling or minifying assets.  

#### **Configuration**
Oryx configures the runtime environment:

Sets up **process managers** (e.g., PM2 for Node.js).  
Configures **web servers** (e.g., Gunicorn for Python, Apache/Nginx for PHP).  
Sets **environment variables** and other settings.  

For **static sites**, Oryx ensures files are placed in the web server’s root directory.

### Step 3: Deployment

Once Oryx has completed the build process, the deployment begins.

#### 1. **Zipping the Application**
Oryx packages the application into a compressed zip file containing:

**Source Code** – JavaScript, Python scripts, Java classes, etc.  
**Dependencies** – Installed packages (`node_modules`, `site-packages`, etc.).  
**Configuration Files** – `.env`, `web.config`, `appsettings.json`.  
**Static Assets** – HTML, CSS, JavaScript, images, etc.  

#### 2. **Transferring to Azure**
The zip file is uploaded to **Azure Blob Storage** (temporary storage) to manage deployments efficiently.  
Azure optimizes this process for **high-speed, secure transfers**.  

#### 3. **Unzipping the Application in Azure**
The zip file is extracted into `/home/site/wwwroot/` (root directory for Azure App Service).  
**File Structure** remains consistent (e.g., `node_modules` stays intact).  

#### 4. **Configuring the Runtime Environment**
Azure sets up the web server and **determines the startup command**, such as:  
**Node.js** → `node server.js` or `npm start`  
**Python** → `gunicorn app:app`  
**.NET Core** → `dotnet <your-app>.dll`  
**Java** → `java -jar your-app.jar`  
If necessary, **process managers** like PM2 (Node.js) are used.  

#### 5. **Starting the Application**
The app **goes live** after configuration.  
Azure runs **health checks and logging** via the **Azure Portal/Kudu**.  

#### 6. **Handling Multiple Deployments**
**Incremental Deployments** – Only changed files are updated.  
**Blue-Green Deployments** – Enables switching between application versions with **zero downtime**.  

#### 7. **Final Verification**
**Post-Deployment Testing** – Automated/manual checks.  
**Performance Monitoring** – Azure provides CPU, memory, and response time metrics.  

---

## 4. Benefits of Using Oryx

**Automatic Language Detection** – Eliminates manual configuration.  
**Unified Build Process** – Standardized across different environments.  
**Optimized Deployment** – Fast and efficient automation.  
**Consistency Across Environments** – Avoids "it works on my machine" issues.  

---

## 5. Example Workflows for Different Languages

### **Node.js**
Push app with `package.json` to Azure.  
Oryx detects Node.js, runs `npm install`, and sets up the app.  

### **Python**
Deploy a Python app with `requirements.txt`.  
Oryx installs dependencies and configures Gunicorn/Flask.  

### **.NET Core**
Deploy a .NET Core app with `.csproj`.  
Oryx restores, builds, and deploys the project.  

### **PHP**
Push a PHP app with `composer.json`.  
Oryx runs `composer install` and sets up Apache/Nginx.  

### **Java**
Deploy a Java app with `pom.xml`.  
Oryx builds via Maven/Gradle and configures the server.  

---

## 6. Conclusion

Oryx simplifies deployment by **automatically detecting, building, and configuring** applications for Azure App Service. It ensures seamless cloud deployment with minimal manual intervention, making it easier to manage applications in a **consistent and reliable manner**.

---

## References

- [Oryx GitHub Repository](https://github.com/microsoft/Oryx)
- [Azure App Service Documentation](https://learn.microsoft.com/en-us/azure/app-service/)
