const { ethers } = require('ethers');

const gsnAbi = [
  'function executeSwapBV3ForETH(address user,uint256 deadline,bytes signature)',
  'function executePartI(address user,address privacyContractAddress,uint256[] encryptedArray,uint256 deadline,bytes signature)',
  'function executePartII(address user,address privacyContractAddress,uint256[] encryptedArray,uint256 deadline,bytes signature)',
];

const headers = {
  'Access-Control-Allow-Origin': process.env.RELAY_ALLOWED_ORIGIN || '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function readPayload(params) {
  const body = params?.request?.body ?? params?.body ?? params;
  return typeof body === 'string' ? JSON.parse(body) : body;
}

exports.handler = async function (params) {
  if (params?.request?.method === 'OPTIONS') {
    return {
      statusCode: 204,
      headers,
      body: '',
    };
  }

  try {
    const payload = readPayload(params);
    const target = payload.target || process.env.GSN_ADDRESS;
    const configuredTarget = process.env.GSN_ADDRESS;

    if (!target) {
      throw new Error('Missing GSN target address.');
    }

    if (configuredTarget && target.toLowerCase() !== configuredTarget.toLowerCase()) {
      throw new Error('Relay target is not allowed.');
    }

    if (!process.env.RELAY_RPC_URL || !process.env.RELAYER_PRIVATE_KEY) {
      throw new Error('Relay RPC URL or private key is not configured.');
    }

    const provider = new ethers.providers.JsonRpcProvider(process.env.RELAY_RPC_URL);
    const signer = new ethers.Wallet(process.env.RELAYER_PRIVATE_KEY, provider);
    const contract = new ethers.Contract(target, gsnAbi, signer);
    const gasLimit = process.env.RELAY_GAS_LIMIT
      ? ethers.BigNumber.from(process.env.RELAY_GAS_LIMIT)
      : ethers.BigNumber.from('900000');
    const request = payload.request || {};

    let tx;

    if (payload.functionName === 'executeSwapBV3ForETH') {
      tx = await contract.executeSwapBV3ForETH(request.user, request.deadline, request.signature, {
        gasLimit,
      });
    } else if (payload.functionName === 'executePartI') {
      tx = await contract.executePartI(
        request.user,
        request.privacyContractAddress,
        request.encryptedArray,
        request.deadline,
        request.signature,
        { gasLimit },
      );
    } else if (payload.functionName === 'executePartII') {
      tx = await contract.executePartII(
        request.user,
        request.privacyContractAddress,
        request.encryptedArray,
        request.deadline,
        request.signature,
        { gasLimit },
      );
    } else {
      throw new Error('Unsupported relay function.');
    }

    const receipt = await tx.wait();

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        transactionHash: tx.hash,
        blockNumber: receipt.blockNumber,
        status: receipt.status,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: error instanceof Error ? error.message : 'Relay execution failed.',
      }),
    };
  }
};
