import { platform } from 'os';

import { OperatingSystems } from './types';

export function getOperatingSystem() {
  const platformName = platform();
  let operatingSystem: OperatingSystems;

  if (platformName === 'win32') {
    operatingSystem = OperatingSystems.windows;
  } else if (platformName === 'darwin') {
    operatingSystem = OperatingSystems.mac;
  } else {
    operatingSystem = OperatingSystems.linux;
  }

  return operatingSystem;
}
