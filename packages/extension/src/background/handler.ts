import { CHAINX_ACCOUNT_CREATE, CHAINX_ACCOUNT_ALL } from "./constants";
import { ChainxAccountCreateRequest, AccountInfo } from './types';
import keyring from './keyring';

// @ts-ignore
import { PORT_POPUP } from '@chainx/extension-defaults';

export interface MessageRequest {
  id: string;
  message: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  request: any;
}

// @ts-ignore
async function createChainxAccount({ name, mnemonic, password }: ChainxAccountCreateRequest) {
  await keyring.addFromMnemonic(name, mnemonic, password);

  return true;
}

async function getAllChainxAccount(): Promise<AccountInfo[]> {
  return keyring.accounts.map(account => ({
    name: account.name,
    address: account.address
  }));
}

function handlePopup({ id, message, request }: MessageRequest): Promise<any> {
  switch (message) {
    case CHAINX_ACCOUNT_CREATE:
      return createChainxAccount(request);
    case CHAINX_ACCOUNT_ALL:
      return getAllChainxAccount();
  }

  return Promise.resolve()
}

async function handleContent({ id, message, request }: MessageRequest) {
  console.log(`id: ${id}, message: ${message}, request: ${request}`);

  return true;
}

export default function (request: MessageRequest, port: chrome.runtime.Port): Promise<any> {
  if (port.name === PORT_POPUP) {
    return handlePopup(request);
  } else {
    return handleContent(request);
  }
}
