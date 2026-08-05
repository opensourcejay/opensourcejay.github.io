# Setting Up a macOS Development Machine
*June 27, 2026*
*Jay*

A good development setup should be reproducible, secure, and easy to update. The goal is not to install every tool you might someday use. It is to create a dependable base and add project-specific software only when you need it.

This guide prepares a new Mac for Git, Node.js, Python, Visual Studio Code, and optional container development.

---

## Update and Secure the Mac

Install current macOS updates from **System Settings > General > Software Update**.

Turn on FileVault under **System Settings > Privacy & Security > FileVault**. Store the recovery information somewhere separate from the Mac. FileVault protects data at rest if the machine is lost or stolen.

Use a standard daily account when your organization requires it, keep screen locking enabled, and review applications before granting Accessibility, Full Disk Access, microphone, camera, or screen-recording permissions.

## Install the Command Line Tools

Open Terminal and run:

```bash
xcode-select --install
```

After installation, verify the active developer directory:

```bash
xcode-select --print-path
git --version
clang --version
```

The Command Line Tools provide Git, compilers, and headers needed by many package installations. Install the full Xcode application only when your work requires Apple platform SDKs or simulators.

## Install Homebrew

Use the installation command shown on the official [Homebrew website](https://brew.sh/). Read the script before running it.

At the end, the installer prints commands that add Homebrew to your shell environment. Run the commands it gives you. The installation prefix differs between Apple silicon and Intel Macs, so do not hard-code another machine's path.

Verify the setup:

```bash
brew --version
brew doctor
brew update
```

Homebrew should not require `sudo` for normal package operations. If a guide asks you to change ownership across broad system directories, stop and inspect the actual permissions problem.

Install a few general tools:

```bash
brew install git jq
```

Avoid installing every language runtime directly through Homebrew. Version managers are often a better fit when projects require different runtime versions.

## Configure Git

Set your commit identity:

```bash
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
git config --global init.defaultBranch main
```

Inspect the result:

```bash
git config --global --list
```

If you use separate work and personal identities, use Git's conditional includes instead of constantly replacing the global email address.

## Create an SSH Key for GitHub

Create a unique key for this machine:

```bash
ssh-keygen -t ed25519 -C "you@example.com"
```

Accept the default location unless you already manage multiple keys. Use a strong passphrase, then start the agent and add the key to the macOS keychain:

```bash
eval "$(ssh-agent -s)"
ssh-add --apple-use-keychain ~/.ssh/id_ed25519
```

Copy the public key:

```bash
pbcopy < ~/.ssh/id_ed25519.pub
```

Add it to your GitHub account, then test the connection:

```bash
ssh -T git@github.com
```

Never share the private key. The `.pub` file is the part intended to be copied to services.

## Install Node.js with nvm

macOS uses zsh as its default interactive shell. Install nvm using the current instructions in its official repository. The installer normally adds its startup lines to `~/.zshrc`.

Open `~/.zshrc` and confirm it contains the following lines. Add them if the installer did not:

```bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
```

Load the updated zsh configuration:

```bash
source ~/.zshrc
command -v nvm
```

Then install the current long-term support release:

```bash
nvm install --lts
nvm use --lts
node --version
npm --version
```

Add an `.nvmrc` file to projects that require a specific Node.js release. Run `nvm use` in that project to select it.

Do not install project packages globally unless the tool specifically requires it. Prefer project-local dependencies and package scripts.

## Use Python Virtual Environments

macOS includes software that may depend on system-managed Python components. Do not replace or modify system Python.

For many projects, install a separate Python through Homebrew:

```bash
brew install python
python3 --version
pip3 --version
```

Many tutorials use `python` and `pip`, while Homebrew exposes the versioned `python3` and `pip3` commands. To make the shorter commands available in zsh, open the shell configuration:

```bash
nano ~/.zshrc
```

Add these aliases:

```bash
alias python=python3
alias pip='python3 -m pip'
```

Using `python3 -m pip` keeps pip tied to the Python interpreter selected by your current environment. Save the file, then reload and verify the aliases:

```bash
source ~/.zshrc
type python
type pip
python --version
pip --version
```

These aliases affect interactive zsh sessions. Scripts should use an explicit interpreter or a project environment instead of depending on a personal shell alias.

Create an isolated environment per project:

```bash
mkdir -p ~/Developer/python-demo
cd ~/Developer/python-demo
python -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip
```

Use a Python version manager when different projects require different interpreter versions. Whichever approach you choose, record the required Python version and dependencies in the repository.

## Install Visual Studio Code

Install Visual Studio Code using the official download or Homebrew:

```bash
brew install --cask visual-studio-code
```

In VS Code, open the Command Palette and run **Shell Command: Install 'code' command in PATH**. Then test it:

```bash
mkdir -p ~/Developer
cd ~/Developer
code .
```

Install extensions based on the project, not from a large generic list. Every extension runs code with access to your editor context, so review its publisher, permissions, and maintenance history.

## Add Containers Only If Needed

Docker Desktop is one option for local containers on macOS. Install it from the official site and review its CPU, memory, filesystem, and network settings.

After installation, verify it:

```bash
docker version
docker compose version
docker run --rm hello-world
```

Containers run inside a Linux virtual machine on macOS. Native macOS and Linux container behavior can differ, especially around filesystem performance, file permissions, and CPU architecture.

On Apple silicon, prefer images that publish an `arm64` variant. Install Rosetta only when a trusted Intel-only tool requires it. Rosetta is a compatibility layer, not a default requirement for a modern development setup.

## Organize Projects and Configuration

Use a predictable directory such as:

```bash
mkdir -p ~/Developer
```

Keep shell and tool configuration in version-controlled dotfiles only after removing credentials, machine identifiers, and private paths. Store secrets in a password manager, macOS Keychain, or a project-approved secret store, never in the dotfiles repository.

Add project `.env` files to `.gitignore`. Commit an `.env.example` containing names and safe placeholders when other contributors need to know which variables exist.

## Verify the Setup

Run this checklist in Terminal:

```bash
xcode-select --print-path
brew --version
git --version
git config --global user.name
git config --global user.email
node --version
npm --version
python3 --version
code --version
```

Run Docker checks only if you installed a container runtime.

A development machine is never truly finished. Keep the base small, document project requirements, update deliberately, and remove tools you no longer use. Reproducibility matters more than an impressive list of installed packages.

## Sources

- [Apple: Use FileVault to Encrypt Your Mac](https://support.apple.com/guide/mac-help/protect-data-on-your-mac-with-filevault-mh11785/mac)
- [Apple: Xcode Command Line Tools](https://developer.apple.com/xcode/resources/)
- [Homebrew Documentation](https://docs.brew.sh/)
- [GitHub: Connecting with SSH](https://docs.github.com/en/authentication/connecting-to-github-with-ssh)
- [nvm Repository](https://github.com/nvm-sh/nvm)
- [Python Virtual Environments](https://docs.python.org/3/tutorial/venv.html)
- [VS Code on macOS](https://code.visualstudio.com/docs/setup/mac)
- [Docker Desktop for Mac](https://docs.docker.com/desktop/setup/install/mac-install/)