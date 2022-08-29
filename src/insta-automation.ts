import {
  Address,
  BigInt,
  Bytes,
  dataSource,
  log,
} from "@graphprotocol/graph-ts";
import {
  InstaAutomation,
  LogCancelledAutomation,
  LogChangedOwner,
  LogExecutedAutomation,
  LogExecutionFailedAutomation,
  LogFeeTransferred,
  LogFlippedExecutors,
  LogSubmittedAutomation,
  LogSystemCall,
  LogSystemCancelledAutomation,
  LogUpdatedAutomationFee,
  LogUpdatedBufferHf,
  LogUpdatedMinHf,
} from "../generated/InstaAutomation/InstaAutomation";
import {
  ExecuteData,
  ExecutionParams,
  Spell,
  Swap,
  Account,
  SubmitData,
  CancelData,
  SystemCancelData,
  Executor,
} from "../generated/schema";
import {
  createOrLoadCancelData,
  createOrLoadChangedOwner,
  createOrLoadDsa,
  createOrLoadExecute,
  createOrLoadExecutionParams,
  createOrLoadFailedExecution,
  createOrLoadFeeTransferData,
  createOrLoadSubmit,
  createOrLoadSwap,
  createOrLoadSystemCallData,
  createOrLoadSystemCancelData,
  createOrLoadTransaction,
  createOrUpdateAutomationFeeData,
  createOrUpdateBufferHfData,
  createOrUpdateMinHfData,
} from "./insta-index";

export function handleLogSubmitAutomation(event: LogSubmittedAutomation): void {
  let dsaId =
    event.params.user.toHexString() + "#" + event.params.id.toString();
  let eventId =
    event.transaction.hash.toHexString() + event.logIndex.toString();

  log.info("transaction hash: {} and from: {} ", [
    event.transaction.hash.toHexString(),
    event.transaction.from.toHexString(),
  ]);
  log.info("ID: {}", [dsaId]);

  let dsa = createOrLoadDsa(dsaId);
  dsa.user = event.params.user;
  let submitData = createOrLoadSubmit(eventId);
  submitData.user = event.params.user;
  submitData.userId = event.params.id;
  submitData.safeHF = event.params.safeHF;
  submitData.thresholdHF = event.params.thresholdHF;
  submitData.currentHf = event.params.currentHf;
  submitData.account = dsaId;
  let transaction = createOrLoadTransaction(eventId);
  transaction.blockNumber = event.block.number;
  transaction.timeStamp = event.block.timestamp;
  transaction.logIndex = event.logIndex;
  transaction.transactionHash = event.transaction.hash;
  transaction.transactionLogIndex = event.transactionLogIndex;
  submitData.transactionDetail = transaction.id;

  transaction.save();
  submitData.save();
  dsa.save();
}

export function handleLogCancelAutomation(event: LogCancelledAutomation): void {
  let dsaId =
    event.params.user.toHexString() + "#" + event.params.id.toString();
  let eventId =
    event.transaction.hash.toHexString() + event.logIndex.toString();

  log.info("transaction hash: {} and from: {} ", [
    event.transaction.hash.toHexString(),
    event.transaction.from.toHexString(),
  ]);
  log.info("ID: {}", [dsaId]);

  let dsa = createOrLoadDsa(dsaId);
  dsa.user = event.params.user;
  let cancelData = createOrLoadCancelData(eventId);

  cancelData.user = event.params.user;
  cancelData.userId = event.params.id;
  cancelData.nonce = event.params.nonce;
  cancelData.account = dsaId;
  let transaction = createOrLoadTransaction(eventId);
  transaction.blockNumber = event.block.number;
  transaction.timeStamp = event.block.timestamp;
  transaction.logIndex = event.logIndex;
  transaction.transactionHash = event.transaction.hash;
  transaction.transactionLogIndex = event.transactionLogIndex;
  cancelData.transactionDetail = transaction.id;

  transaction.save();
  cancelData.save();
  dsa.save();
}

export function handleSystemCancelledAutomation(
  event: LogSystemCancelledAutomation
): void {
  let dsaId =
    event.params.user.toHexString() + "#" + event.params.id.toString();
  let eventId =
    event.transaction.hash.toHexString() + event.logIndex.toString();

  log.info("transaction hash: {} and from: {} ", [
    event.transaction.hash.toHexString(),
    event.transaction.from.toHexString(),
  ]);
  log.info("ID: {}", [dsaId]);

  let dsa = createOrLoadDsa(dsaId);
  dsa.user = event.params.user;
  let cancelData = createOrLoadSystemCancelData(eventId);

  cancelData.user = event.params.user;
  cancelData.userId = event.params.id;
  cancelData.nonce = event.params.nonce;
  cancelData.errorCode = event.params.errorCode;
  cancelData.account = dsaId;
  let transaction = createOrLoadTransaction(eventId);
  transaction.blockNumber = event.block.number;
  transaction.timeStamp = event.block.timestamp;
  transaction.logIndex = event.logIndex;
  transaction.transactionHash = event.transaction.hash;
  transaction.transactionLogIndex = event.transactionLogIndex;
  cancelData.transactionDetail = transaction.id;

  transaction.save();
  cancelData.save();
  dsa.save();
}

export function handleLogExecuteAutomation(event: LogExecutedAutomation): void {
  let dsaId =
    event.params.user.toHexString() + "#" + event.params.id.toString();
  let eventId =
    event.transaction.hash.toHexString() + event.logIndex.toString();

  log.info("transaction hash: {} and from: {} ", [
    event.transaction.hash.toHexString(),
    event.transaction.from.toHexString(),
  ]);
  log.info("ID: {}", [dsaId]);

  let dsa = createOrLoadDsa(dsaId);
  dsa.user = event.params.user;
  let executeData = createOrLoadExecute(eventId);
  let params = createOrLoadExecutionParams(eventId);

  executeData.user = event.params.user;
  executeData.userId = event.params.id;
  executeData.nonce = event.params.nonce;
  executeData.finalHf = event.params.finalHf;
  executeData.initialHf = event.params.initialHf;
  executeData.automationFee = event.params.automationFee;
  params.collateralToken = event.params.params.collateralToken;
  params.debtToken = event.params.params.debtToken;
  params.collateralAmount = event.params.params.collateralAmount;
  params.debtAmount = event.params.params.debtAmount;
  params.collateralAmountWithTotalFee =
    event.params.params.collateralAmountWithTotalFee;
  executeData.isSafe = event.params.isSafe;
  executeData.metaData = event.params.metadata;
  let swaps = createOrLoadSwap(eventId);
  swaps.buyToken = event.params.params.swap.buyToken;
  swaps.sellToken = event.params.params.swap.sellToken;
  swaps.sellAmt = event.params.params.swap.sellAmt;
  swaps.unitAmt = event.params.params.swap.unitAmt;
  swaps.callData = event.params.params.swap.callData;
  params.swap = swaps.id;
  executeData.params = params.id;
  executeData.account = dsaId;
  let transaction = createOrLoadTransaction(eventId);
  transaction.blockNumber = event.block.number;
  transaction.timeStamp = event.block.timestamp;
  transaction.logIndex = event.logIndex;
  transaction.transactionHash = event.transaction.hash;
  transaction.transactionLogIndex = event.transactionLogIndex;
  executeData.transactionDetail = transaction.id;

  transaction.save();
  params.save();
  swaps.save();
  executeData.save();
  dsa.save();
}

export function handleLogChangedOwner(event: LogChangedOwner): void {
  let eventId =
    event.transaction.hash.toHexString() + event.logIndex.toString();

  let changeOwnerData = createOrLoadChangedOwner(eventId);
  changeOwnerData.oldOwner = event.params.oldOnwer;
  changeOwnerData.newOwner = event.params.newOnwer;
  let transaction = createOrLoadTransaction(eventId);
  transaction.blockNumber = event.block.number;
  transaction.timeStamp = event.block.timestamp;
  transaction.logIndex = event.logIndex;
  transaction.transactionHash = event.transaction.hash;
  transaction.transactionLogIndex = event.transactionLogIndex;
  changeOwnerData.transactionDetail = transaction.id;

  transaction.save();
  changeOwnerData.save();
}

export function handleLogFeeTransferred(event: LogFeeTransferred): void {
  let eventId =
    event.transaction.hash.toHexString() + event.logIndex.toString();

  let data = createOrLoadFeeTransferData(eventId);
  data.recipient = event.params.recipient;
  let tokens = event.params.tokens;
  let amounts = event.params.amount;
  data.from = event.transaction.from;
  let dataTokens = data.tokens;
  let dataAmounts = data.amount;

  for (let i = 0; i < tokens.length; i++) {
    dataTokens.push(tokens[i]);
    dataAmounts.push(amounts[i]);
  }

  data.tokens = dataTokens;
  data.amount = dataAmounts;
  let transaction = createOrLoadTransaction(eventId);
  transaction.blockNumber = event.block.number;
  transaction.timeStamp = event.block.timestamp;
  transaction.logIndex = event.logIndex;
  transaction.transactionHash = event.transaction.hash;
  transaction.transactionLogIndex = event.transactionLogIndex;
  data.transactionDetail = transaction.id;

  transaction.save();
  data.save();
}

export function handleLogSystemCall(event: LogSystemCall): void {
  let eventId =
    event.transaction.hash.toHexString() + event.logIndex.toString();

  let data = createOrLoadSystemCallData(eventId);
  data.sender = event.params.sender;
  data.actionId = event.params.actionId;
  data.metaData = event.params.metadata;
  let transaction = createOrLoadTransaction(eventId);
  transaction.blockNumber = event.block.number;
  transaction.timeStamp = event.block.timestamp;
  transaction.logIndex = event.logIndex;
  transaction.transactionHash = event.transaction.hash;
  transaction.transactionLogIndex = event.transactionLogIndex;
  data.transactionDetail = transaction.id;

  transaction.save();
  data.save();
}

export function handleLogUpdateAutomationFee(
  event: LogUpdatedAutomationFee
): void {
  let eventId =
    event.transaction.hash.toHexString() + event.logIndex.toString();

  let data = createOrUpdateAutomationFeeData(eventId);
  data.oldAutomationFee = event.params.oldAutomationFee;
  data.newAutomationFee = event.params.newAutomationFee;
  let transaction = createOrLoadTransaction(eventId);
  transaction.blockNumber = event.block.number;
  transaction.timeStamp = event.block.timestamp;
  transaction.logIndex = event.logIndex;
  transaction.transactionHash = event.transaction.hash;
  transaction.transactionLogIndex = event.transactionLogIndex;
  data.transactionDetail = transaction.id;

  transaction.save();
  data.save();
}

export function handleUpdatedBufferHf(event: LogUpdatedBufferHf): void {
  let eventId =
    event.transaction.hash.toHexString() + event.logIndex.toString();

  let data = createOrUpdateBufferHfData(eventId);
  data.oldBuffer = event.params.oldBufferHf;
  data.newBuffer = event.params.newBufferHf;
  let transaction = createOrLoadTransaction(eventId);
  transaction.blockNumber = event.block.number;
  transaction.timeStamp = event.block.timestamp;
  transaction.logIndex = event.logIndex;
  transaction.transactionHash = event.transaction.hash;
  transaction.transactionLogIndex = event.transactionLogIndex;
  data.transactionDetail = transaction.id;

  transaction.save();
  data.save();
}

export function handleLogUpdatedMinHf(event: LogUpdatedMinHf): void {
  let eventId =
    event.transaction.hash.toHexString() + event.logIndex.toString();

  let data = createOrUpdateMinHfData(eventId);
  data.oldMinHf = event.params.oldMinHf;
  data.newMinHf = event.params.newMinHf;
  let transaction = createOrLoadTransaction(eventId);
  transaction.blockNumber = event.block.number;
  transaction.timeStamp = event.block.timestamp;
  transaction.logIndex = event.logIndex;
  transaction.transactionHash = event.transaction.hash;
  transaction.transactionLogIndex = event.transactionLogIndex;
  data.transactionDetail = transaction.id;

  transaction.save();
  data.save();
}

export function handleExecutors(event: LogFlippedExecutors): void {
  let id = "ALL";
  let executors_ = Executor.load(id);
  if (executors_ == null) {
    executors_ = new Executor(id);
    executors_.executors = [];
  }
  let execArr = executors_.executors;
  let statusArr = event.params.status;
  for (let i = 0; i < event.params.executors.length; i++) {
    let index = execArr.indexOf(event.params.executors[i]);
    if (statusArr[i] === true) {
      if (index == -1) {
        execArr.push(event.params.executors[i]);
      }
    } else {
      if (index != -1) {
        execArr.splice(index - 1, 1);
      }
    }
  }
  executors_.executors = execArr;
  executors_.save();
}

export function handleLogFailedExecution(
  event: LogExecutionFailedAutomation
): void {
  let dsaId =
    event.params.user.toHexString() + "#" + event.params.id.toString();
  let eventId =
    event.transaction.hash.toHexString() + event.logIndex.toString();

  log.info("transaction hash: {} and from: {} ", [
    event.transaction.hash.toHexString(),
    event.transaction.from.toHexString(),
  ]);
  log.info("ID: {}", [dsaId]);

  let dsa = createOrLoadDsa(dsaId);
  dsa.user = event.params.user;
  let failedExecuteData = createOrLoadFailedExecution(eventId);
  let params = createOrLoadExecutionParams(eventId);

  failedExecuteData.user = event.params.user;
  failedExecuteData.userId = event.params.id;
  failedExecuteData.nonce = event.params.nonce;
  failedExecuteData.initialHf = event.params.initialHf;
  params.collateralToken = event.params.params.collateralToken;
  params.debtToken = event.params.params.debtToken;
  params.collateralAmount = event.params.params.collateralAmount;
  params.debtAmount = event.params.params.debtAmount;
  params.collateralAmountWithTotalFee =
    event.params.params.collateralAmountWithTotalFee;
  failedExecuteData.metadata = event.params.metadata;
  let swaps = createOrLoadSwap(eventId);
  swaps.buyToken = event.params.params.swap.buyToken;
  swaps.sellToken = event.params.params.swap.sellToken;
  swaps.sellAmt = event.params.params.swap.sellAmt;
  swaps.unitAmt = event.params.params.swap.unitAmt;
  swaps.callData = event.params.params.swap.callData;
  params.swap = swaps.id;
  failedExecuteData.params = params.id;
  failedExecuteData.account = dsaId;
  let transaction = createOrLoadTransaction(eventId);
  transaction.blockNumber = event.block.number;
  transaction.timeStamp = event.block.timestamp;
  transaction.logIndex = event.logIndex;
  transaction.transactionHash = event.transaction.hash;
  transaction.transactionLogIndex = event.transactionLogIndex;
  failedExecuteData.transactionDetail = transaction.id;

  transaction.save();
  params.save();
  swaps.save();
  failedExecuteData.save();
  dsa.save();
}
