import { platform } from 'os';

import { OperatingSystems } from './types';

export function getOperatingSystem() {
  const platformName = platform();
  let OPERATING_SYSTEM: OperatingSystems;

  if (platformName === 'win32') {
    OPERATING_SYSTEM = OperatingSystems.windows;
  } else if (platformName === 'darwin') {
    OPERATING_SYSTEM = OperatingSystems.mac;
  } else {
    OPERATING_SYSTEM = OperatingSystems.linux;
  }

  return OPERATING_SYSTEM;
}
