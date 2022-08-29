import {
  Address,
  BigInt,
  Bytes,
  DataSourceContext,
} from "@graphprotocol/graph-ts";
import { Account, ExecutionParams, SubmitData, Swap, Spell, ExecuteData, CancelData, SystemCancelData, TransactionData, ChangedOwner, FeeTransferData, SystemCallData, UpdateAutomationFeeData, UpdateBufferHfData, UpdateMinHfData, FailedExecution } from "../generated/schema";
import { InstaAutomation } from "../generated/InstaAutomation/InstaAutomation";
import { InstaAutomation as InstaAutomationABI } from "../generated/templates";

export const ZERO = new BigInt(0);
export const ADDR_ZERO = new Address(0);

//loads or creates smart account
export function createOrLoadDsa(id: string): Account {
  let account = Account.load(id);
  if (account == null) {
    account = new Account(id);
    account.user = ADDR_ZERO;
  }
  return account;
}

export function createOrLoadSubmit(id: string): SubmitData {
    let submitData = SubmitData.load(id);
    if(submitData == null) {
        submitData = new SubmitData(id);
        submitData.user = ADDR_ZERO;
        submitData.userId = ZERO;
        submitData.safeHF = ZERO;
        submitData.thresholdHF = ZERO;
        submitData.currentHf = ZERO;
        submitData.transactionDetail = createOrLoadTransaction(id).id;
    }
    return submitData;
}

export function createOrLoadTransaction(id: string): TransactionData {
  let transactionData = TransactionData.load(id);
  if(transactionData == null) {
      transactionData = new TransactionData(id);
      transactionData.blockNumber = ZERO;
      transactionData.timeStamp = ZERO;
      transactionData.logIndex = ZERO;
      transactionData.transactionHash = ADDR_ZERO;
      transactionData.transactionLogIndex = ZERO; 
  }
  return transactionData;
}

export function createOrLoadChangedOwner(id: string): ChangedOwner {
  let ownerData = ChangedOwner.load(id);
  if(ownerData == null) {
      ownerData = new ChangedOwner(id);
      ownerData.oldOwner = ADDR_ZERO;
      ownerData.newOwner = ADDR_ZERO; 
      ownerData.transactionDetail = createOrLoadTransaction(id).id;
  }
  return ownerData;
}

export function createOrLoadExecutionParams(id: string): ExecutionParams {
    let params = ExecutionParams.load(id);
    if(params == null) {
        params = new ExecutionParams(id);
        params.collateralToken = ADDR_ZERO;
        params.debtToken = ADDR_ZERO;
        params.collateralAmount = ZERO;
        params.debtAmount = ZERO;
        params.collateralAmountWithTotalFee = ZERO;
        params.swap = createOrLoadSwap(id).id;
        params.route = ZERO;
        params.rateMode = ZERO;
        params.route = ZERO;        
    }
    return params;
}

export function createOrLoadSwap(id: string): Swap {
  let swap = Swap.load(id);
  if(swap == null){
    swap = new Swap(id);
    swap.buyToken = ADDR_ZERO;
    swap.sellToken = ADDR_ZERO;
    swap.sellAmt = ZERO;
    swap.unitAmt = ZERO;
    swap.callData = new Bytes(0);
  }
  return swap;
}

export function createOrLoadExecute(id: string): ExecuteData {
  let data = ExecuteData.load(id);
  if(data == null) {
    data = new ExecuteData(id);
    data.user = ADDR_ZERO;
    data.userId = ZERO;
    data.nonce = ZERO;
    data.finalHf = ZERO;
    data.initialHf = ZERO;
    data.automationFee = 0;
    data.params = createOrLoadExecutionParams(id).id;
    data.transactionDetail = createOrLoadTransaction(id).id;
    data.isSafe = false;
    data.metaData = new Bytes(0);
  }
  return data;
}

export function createOrLoadFailedExecution(id: string): FailedExecution {
  let data = FailedExecution.load(id);
  if(data == null) {
    data = new FailedExecution(id);
    data.user = ADDR_ZERO;
    data.userId = ZERO;
    data.nonce = ZERO;
    data.initialHf = ZERO;
    data.params = createOrLoadExecutionParams(id).id;
    data.transactionDetail = createOrLoadTransaction(id).id;
    data.metadata = new Bytes(0);
  }
  return data;
}

export function createOrLoadCancelData(id: string): CancelData {
  let data = CancelData.load(id);
  if(data == null) {
    data = new CancelData(id);
    data.user = ADDR_ZERO;
    data.userId = ZERO;
    data.nonce = ZERO;
    data.transactionDetail = createOrLoadTransaction(id).id;
  }
  return data;
}


export function createOrLoadSystemCancelData(id: string): SystemCancelData {
  let data = SystemCancelData.load(id);
  if(data == null) {
    data = new SystemCancelData(id);
    data.user = ADDR_ZERO;
    data.userId = ZERO;
    data.nonce = ZERO;
    data.errorCode = 0;
    data.transactionDetail = createOrLoadTransaction(id).id;
  }
  return data;
}

export function createOrLoadFeeTransferData(id: string): FeeTransferData {
  let data = FeeTransferData.load(id);
  if(data == null) {
    data = new FeeTransferData(id);
    data.recipient = ADDR_ZERO;
    data.from = ADDR_ZERO;
    data.tokens = [];
    data.amount = [];
    data.transactionDetail = createOrLoadTransaction(id).id;
  }
  return data;
}

export function createOrLoadSystemCallData(id: string): SystemCallData {
  let data = SystemCallData.load(id);
  if(data == null) {
    data = new SystemCallData(id);
    data.sender = ADDR_ZERO;
    data.actionId = "";
    data.metaData = new Bytes(0);
    data.transactionDetail = createOrLoadTransaction(id).id;
  }
  return data;
}

export function createOrUpdateAutomationFeeData(id: string): UpdateAutomationFeeData {
  let data = UpdateAutomationFeeData.load(id);
  if(data == null) {
    data = new UpdateAutomationFeeData(id);
    data.oldAutomationFee = 0;
    data.newAutomationFee = 0;
    data.transactionDetail = createOrLoadTransaction(id).id;
  }
  return data;
}

export function createOrUpdateBufferHfData(id: string): UpdateBufferHfData {
  let data = UpdateBufferHfData.load(id);
  if(data == null) {
    data = new UpdateBufferHfData(id);
    data.oldBuffer = ZERO;
    data.newBuffer = ZERO;
    data.transactionDetail = createOrLoadTransaction(id).id;
  }
  return data;
}

export function createOrUpdateMinHfData(id: string): UpdateMinHfData {
  let data = UpdateMinHfData.load(id);
  if(data == null) {
    data = new UpdateMinHfData(id);
    data.oldMinHf = ZERO;
    data.newMinHf = ZERO;
    data.transactionDetail = createOrLoadTransaction(id).id;
  }
  return data;
}
