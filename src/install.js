'use strict';

const core = require('@actions/core');
const child_process = require('child_process');

const installPythonDependencies = () => {
  core.info('Installing Python dependencies...');
  child_process.execSync(
    'sudo apt-get update && sudo apt-get install -y python3 pipx gcc build-essential libkrb5-dev python3-setuptools python3-lxml'
  );
  core.info('Setting Python3 as default');
  child_process.execSync(
    'sudo update-alternatives --install /usr/bin/python python /usr/bin/python3 10'
  );
};

const installRequiredPipPackages = () => {
  core.info("Installing required PiP modules...");
  child_process.execSync('PIPX_BIN_DIR=/usr/local/bin pipx install pip', {stdio: 'inherit'});
  child_process.execSync('PIPX_BIN_DIR=/usr/local/bin pipx install wheel', {stdio: 'inherit'});
  child_process.execSync('PIPX_BIN_DIR=/usr/local/bin pipx install odcs', {stdio: 'inherit'});
  child_process.execSync('PIPX_BIN_DIR=/usr/local/bin pipx install --include-deps docker', {stdio: 'inherit'});
  child_process.execSync('PIPX_BIN_DIR=/usr/local/bin pipx install docker_squash', {stdio: 'inherit'});
  child_process.execSync('PIPX_BIN_DIR=/usr/local/bin pipx install behave', {stdio: 'inherit'});
};

const install = inputs => {
  installPythonDependencies();
  installRequiredPipPackages();
  core.info('Installing CEKit...');
  let cekitInstallCommand = 'PIPX_BIN_DIR=/usr/local/bin pipx install cekit';
  if (inputs.version) {
    cekitInstallCommand = `PIPX_BIN_DIR=/usr/local/bin pipx install cekit==${inputs.version}`;
  }
  child_process.execSync(cekitInstallCommand, {stdio: 'inherit'});
  core.addPath('/home/runner/.local/bin');
  const pythonVersion = child_process
    .execSync(`python --version`)
    .toString()
    .replace(/[\n\r]/g, '');
  console.log(`${pythonVersion} installed successfully`);
  const cekitVersion = child_process
    .execSync(`cekit --version`)
    .toString()
    .replace(/[\n\r]/g, '');
  console.log(`CEKit ${cekitVersion} installed successfully`);
};

module.exports = install;
