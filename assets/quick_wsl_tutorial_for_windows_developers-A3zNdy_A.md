# Quick WSL Tutorial for Windows Developers
*June 20, 2026*
*Jay*

Windows Subsystem for Linux, or WSL, gives Windows developers a real Linux environment without requiring a separate computer or a traditional virtual machine workflow. You can use Linux command-line tools while keeping Windows applications such as Visual Studio Code and your browser.

This guide sets up WSL with Ubuntu, Git, Node.js, Python, and VS Code. It also points you to beginner resources for learning the Linux command line.

---

## Check the Requirements

Use a supported version of Windows 11 or Windows 10. Install current Windows updates before beginning.

Open **PowerShell as Administrator** and run:

```powershell
wsl --install
```

This enables the required Windows features and installs the default Linux distribution. Restart Windows when prompted.

If WSL is already installed, inspect its status:

```powershell
wsl --status
wsl --version
wsl --list --verbose
```

Update WSL with:

```powershell
wsl --update
```

To see available distributions or install a specific one:

```powershell
wsl --list --online
wsl --install --distribution Ubuntu
```

Microsoft changes the available distribution names over time, so use the exact name returned by `wsl --list --online`.

## Create Your Linux User

Open Ubuntu from the Start menu. The first launch asks you to create a Linux username and password. This account is separate from your Windows account.

The password does not appear while you type in the terminal. That is normal. The account can use `sudo` for administrative Linux tasks.

Update Ubuntu packages in the **Ubuntu shell**:

```bash
sudo apt update
sudo apt upgrade
```

Install basic tools:

```bash
sudo apt install build-essential curl git
```

Do not run development tools as root and do not use `chmod 777` as a general permissions fix. Keep projects owned by your normal Linux user.

## Keep Projects in the Linux Filesystem

Your Linux home directory is the best default location for projects that use Linux tools:

```bash
mkdir -p ~/projects
cd ~/projects
```

Windows drives are mounted under `/mnt`. For example, the Windows `C:` drive is available at `/mnt/c`.

```bash
ls /mnt/c/Users
```

Working directly under `/mnt/c` is useful when Windows programs must own the files, but Linux-heavy workloads can be slower there. Store Node.js packages and Python environments in the Linux filesystem when possible.

From Windows Explorer, enter `\\wsl$` in the address bar to browse Linux distributions. Avoid manually editing Linux distribution files through hidden Windows application-data directories.

## Configure Git

Set the identity used for commits in the **Ubuntu shell**:

```bash
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
git config --global init.defaultBranch main
```

Verify it:

```bash
git config --global --list
```

Git configuration and credentials inside WSL are separate from Git installed directly on Windows unless you deliberately connect them.

## Install Node.js with nvm

Use the installation command from the official nvm repository. After installation, close and reopen the Ubuntu shell, then install the current long-term support release:

```bash
nvm install --lts
nvm use --lts
node --version
npm --version
```

Using nvm avoids replacing distribution-managed packages and makes switching Node.js versions easier.

## Create a Python Environment

Install Python's virtual environment support:

```bash
sudo apt install python3 python3-pip python3-venv
```

Create and activate an isolated environment inside a project:

```bash
mkdir -p ~/projects/python-demo
cd ~/projects/python-demo
python3 -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip
```

Leave the environment with:

```bash
deactivate
```

## Use VS Code in WSL

Install Visual Studio Code on Windows and add Microsoft's **WSL** extension. Then open a project from the Ubuntu shell:

```bash
cd ~/projects
code .
```

VS Code keeps its user interface on Windows and runs a server inside WSL. The integrated terminal, language tools, Git commands, and extensions installed for WSL operate in the Linux environment.

Look for the WSL indicator in the lower-left corner before installing project dependencies. Running half of a project with Windows tools and half with Linux tools is a common source of path and native-package errors.

## Learn the Linux Command Line

WSL gives you Linux, but the commands and filesystem conventions may be new. Start with [Ubuntu's command-line tutorial](https://ubuntu.com/tutorials/command-line-for-beginners) to learn navigation, files, directories, and basic administration.

Practice these commands inside Ubuntu:

```bash
pwd                 # Show the current directory
ls -la              # List files, including hidden files
cd ~/projects       # Change directories
mkdir demo          # Create a directory
touch demo/note.txt # Create an empty file
cp demo/note.txt demo/copy.txt
mv demo/copy.txt demo/renamed.txt
rm demo/renamed.txt
cat demo/note.txt   # Print a file
man ls              # Read the manual for a command
```

Use `rm` carefully because the Linux shell does not move files to the Windows Recycle Bin. Avoid copying commands you do not understand, especially commands using `sudo`, recursive deletion, or broad permission changes.

For a structured introduction, take the Linux Foundation's free [Introduction to Linux](https://training.linuxfoundation.org/training/introduction-to-linux/) course. The [GNU Coreutils manual](https://www.gnu.org/software/coreutils/manual/coreutils.html) is a detailed reference for common file and text commands. You can also use each command's built-in manual, such as `man cp` or `man chmod`.

## Limit WSL Resources When Necessary

WSL manages memory dynamically. If it consumes too many resources for your workload, create `%UserProfile%\.wslconfig` on Windows:

```ini
[wsl2]
memory=8GB
processors=4
swap=2GB
```

Adjust these values for your machine. Apply the change from PowerShell:

```powershell
wsl --shutdown
```

The next WSL launch starts a new virtual machine using the configuration. Do not copy these limits blindly onto a machine with less memory or fewer processors.

## Useful WSL Commands

Run these from PowerShell or Command Prompt:

```powershell
wsl                         # Open the default distribution
wsl --list --verbose        # List distributions and WSL versions
wsl --distribution Ubuntu   # Open a named distribution
wsl --shutdown              # Stop all running distributions
wsl --terminate Ubuntu      # Stop one distribution
wsl --update                # Update WSL
```

## Troubleshoot Deliberately

When something fails, first identify which environment owns the command and files.

- Run `which node`, `which python`, or `which git` inside Ubuntu.
- Run `wsl --status` and `wsl --list --verbose` from PowerShell.
- Keep one package manager and runtime installation per environment.
- Confirm whether a service listens only inside WSL or is reachable from Windows.
- Use `wsl --shutdown` for a clean WSL restart, but collect useful logs first.

WSL gives you a capable Linux development environment while preserving the Windows desktop. The cleanest setup keeps Linux projects and dependencies inside WSL and uses Windows applications as clients through supported integrations.

## Sources

- [Install WSL](https://learn.microsoft.com/en-us/windows/wsl/install)
- [Basic Commands for WSL](https://learn.microsoft.com/en-us/windows/wsl/basic-commands)
- [Working Across Windows and Linux File Systems](https://learn.microsoft.com/en-us/windows/wsl/filesystems)
- [VS Code: Developing in WSL](https://code.visualstudio.com/docs/remote/wsl)
- [Ubuntu: The Linux Command Line for Beginners](https://ubuntu.com/tutorials/command-line-for-beginners)
- [Linux Foundation: Introduction to Linux](https://training.linuxfoundation.org/training/introduction-to-linux/)
- [GNU Coreutils Manual](https://www.gnu.org/software/coreutils/manual/coreutils.html)
- [nvm Repository](https://github.com/nvm-sh/nvm)
- [Python Virtual Environments](https://docs.python.org/3/tutorial/venv.html)
