#!/usr/bin/env bash

function ensure_shell_supported {
    echo "Checking shell for compatibility"
    case "$SHELL" in
        *"bash")
            echo "Detected bash"
            ;;
        *"zsh")
            echo "Detected zsh"
            ;;
        *)
            echo "Your shell is not supported. Using a non-bash compatible shell for Nitro development is not supported, you're going to have a difficult time withour tooling. Please consider using bash or zsh for nitro development."
            exit 1
            ;;
    esac
}

function ensure_host_os_supported {
    if [[ -z "$SKIP_OS_CHECK" ]]
    then
        echo "Checking OS compatibility"
        if [[ "$(uname)" != "Darwin" ]]
        then
            echo "Looks like you're not on a macOS host. We don't support non-macOS hosts. Exiting"
            exit 1
        fi
    fi
}

function install_asdf_bash_config {
    if ! grep -q "source $HOME/.asdf/asdf.sh" "$HOME/.bash_profile"
    then
        echo "Appending asdf initialization to ~/.bash_profile"
        echo "source $HOME/.asdf/asdf.sh" >> "$HOME/.bash_profile"
    fi

    if ! grep -q  "source $HOME/.asdf/completions/asdf.bash" "$HOME/.bash_profile"
    then
        echo "Appending bash completions to ~/.bash_profile"
        echo "source $HOME/.asdf/completions/asdf.bash" >> "$HOME/.bash_profile"
    fi

    source "$HOME/.asdf/asdf.sh"
}

function install_asdf_zsh_config {
    if ! grep -q "source $HOME/.asdf/asdf.sh" "$HOME/.zshrc"
    then
        echo "Appending asdf initialization to ~/.zshrc"
        echo "source $HOME/.asdf/asdf.sh" >> "$HOME/.zshrc"
    fi

    source "$HOME/.asdf/asdf.sh"

    echo "There are many ways to configure completions for zsh, we don't know which one you use so have a look at the asdf documetnation to figure out how to add completions for whichever framework you use: https://asdf-vm.com/#/core-manage-asdf-vm"
}

function install_asdf_shell_config {
    echo "Adding asdf initialization to shell configuration. Close and reopen your terminal to ensure shell configuration is loaded and asdf is on your PATH."
    case "$SHELL" in
        *"bash")
            install_asdf_bash_config
            ;;
        *"zsh")
            install_asdf_zsh_config
            ;;
    esac
}

function ensure_asdf_version_manager_present {
    echo "Ensuring asdf-vm is present on the host"
    if command -v asdf
    then
        echo "Found an existing installation of asdf-vm"
    else
        if [[ ! -d "$HOME/.asdf" ]]
        then
            echo "asdf-vm was not found. Installing into ~/.asdf now"
            git clone https://github.com/asdf-vm/asdf.git ~/.asdf --branch v0.7.8
        fi
        install_asdf_shell_config
    fi
}

function ensure_asdf_plugin_nodejs {
    if [[ "$(asdf plugin list | grep nodejs)" != "nodejs" ]]
    then
        echo "Installing asdf nodejs plugin"
        asdf plugin add nodejs

        echo "Importing nodejs team's gpg keychain"
        bash ~/.asdf/plugins/nodejs/bin/import-release-team-keyring
    else
        echo "Found asdf nodejs plugin. Skipping"
    fi
}

function ensure_asdf_plugins {
    echo "Ensuring asdf plugins are present"
    ensure_asdf_plugin_nodejs
}

function install_tools {
    echo "Installing tools via asdf"
    asdf install
}

if which node > /dev/null
  then
    echo "node is installed"
  else
    ensure_shell_supported
    ensure_host_os_supported
    ensure_asdf_version_manager_present
    ensure_asdf_plugins
    install_tools
  fi
