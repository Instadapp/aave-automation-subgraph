import { Address, BigInt, Bytes, dataSource, log } from "@graphprotocol/graph-ts";
import {
  InstaAutomation,
  LogCancelledAutomation,
  LogExecutedAutomation,
  LogExecutedAutomationParams,
  LogFlippedExecutors,
  LogSubmittedAutomation,
  LogSystemCancelledAutomation,
} from "../generated/InstaIndex/InstaAutomation";
import {
  ExecuteData,
  ExecuteMetaData,
  ExecutionParams,
  Spell,
  Swap,
  Account,
  SubmitData,
  CancelData,
  SystemCancelData,
  Executor
} from "../generated/schema";
import {
  createOrLoadCancelData,
  createOrLoadDsa,
  createOrLoadExecute,
  createOrLoadExecuteMetaData,
  createOrLoadExecutionParams,
  createOrLoadSpell,
  createOrLoadSubmit,
  createOrLoadSwap,
  createOrLoadSystemCancelData,
} from "./insta-index";

export function handleLogSubmitAutomation(event: LogSubmittedAutomation): void {
  let dsaId = event.params.user.toHexString() + "#" + event.params.id.toString();
  let eventId =
    event.transaction.hash.toHexString() + event.logIndex.toString();

  log.info("transaction hash: {} and from: {} ", [
    event.transaction.hash.toHexString(),
    event.transaction.from.toHexString(),
  ]);
  log.info("ID: {}", [dsaId]);

  let dsa = createOrLoadDsa(dsaId);
  let submitData = createOrLoadSubmit(eventId);
  submitData.user = event.params.user;
  submitData.userId = event.params.id;
  submitData.safeHF = event.params.safeHF;
  submitData.thresholdHF = event.params.thresholdHF;
  submitData.currentHf = event.params.currentHf;
  submitData.account = dsaId;

  submitData.save();
  dsa.save();
}

export function handleLogCancelAutomation(event: LogCancelledAutomation): void {
  let dsaId = event.params.user.toHexString() + "#" + event.params.id.toString();
  let eventId =
    event.transaction.hash.toHexString() + event.logIndex.toString();

  log.info("transaction hash: {} and from: {} ", [
    event.transaction.hash.toHexString(),
    event.transaction.from.toHexString(),
  ]);
  log.info("ID: {}", [dsaId]);

  let dsa = createOrLoadDsa(dsaId);
  let cancelData = createOrLoadCancelData(eventId);

  cancelData.user = event.params.user;
  cancelData.userId = event.params.id;
  cancelData.nonce = event.params.nonce;
  cancelData.account = dsaId;

  cancelData.save();
  dsa.save();
}

export function handleSystemCancelledAutomation(
  event: LogSystemCancelledAutomation
): void {
  let dsaId = event.params.user.toHexString() + "#" + event.params.id.toString();
  let eventId =
    event.transaction.hash.toHexString() + event.logIndex.toString();

  log.info("transaction hash: {} and from: {} ", [
    event.transaction.hash.toHexString(),
    event.transaction.from.toHexString(),
  ]);
  log.info("ID: {}", [dsaId]);

  let dsa = createOrLoadDsa(dsaId);
  let cancelData = createOrLoadSystemCancelData(eventId);

  cancelData.user = event.params.user;
  cancelData.userId = event.params.id;
  cancelData.nonce = event.params.nonce;
  cancelData.errorCode = event.params.errorCode;
  cancelData.account = dsaId;

  cancelData.save();
  dsa.save();
}

export function handleLogExecuteAutomationMetadata(
  event: LogExecutedAutomation
): void {
  let dsaId = event.params.user.toHexString() + "#" + event.params.id.toString();
  let eventId =
    event.transaction.hash.toHexString() + event.logIndex.toString();

  log.info("transaction hash: {} and from: {} ", [
    event.transaction.hash.toHexString(),
    event.transaction.from.toHexString(),
  ]);
  log.info("ID: {}", [dsaId]);

  let dsa = createOrLoadDsa(dsaId);
  let executeData = createOrLoadExecuteMetaData(eventId);

  executeData.user = event.params.user;
  executeData.userId = event.params.id;
  executeData.nonce = event.params.nonce;
  executeData.isSafe = event.params.isSafe;
  executeData.metadata = event.params.metadata;
  executeData.account = dsaId;

  executeData.save();
  dsa.save();
}

export function handleLogExecuteAutomation(
  event: LogExecutedAutomationParams
): void {
  
  let dsaId = event.params.user.toHexString() + "#" + event.params.id.toString();
  let eventId =
    event.transaction.hash.toHexString() + event.logIndex.toString();

  log.info("transaction hash: {} and from: {} ", [
    event.transaction.hash.toHexString(),
    event.transaction.from.toHexString(),
  ]);
  log.info("ID: {}", [dsaId]);

  let dsa = createOrLoadDsa(dsaId);
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
  params.collateralAmountWithTotalFee = event.params.params.collateralAmountWithTotalFee; 
  let swaps = createOrLoadSwap(eventId);
  swaps.buyToken = event.params.params.swap.buyToken;
  swaps.sellToken = event.params.params.swap.sellToken;
  swaps.sellAmt = event.params.params.swap.sellAmt;
  swaps.unitAmt = event.params.params.swap.unitAmt;
  swaps.callData = event.params.params.swap.callData;
  let spells = createOrLoadSpell(eventId);
  spells._datas = event.params.spells._datas;
  spells._targets = event.params.spells._targets;
  params.swap = swaps.id; 
  executeData.params = params.id;
  executeData.spells = spells.id;
  executeData.account = dsaId;

  params.save();
  swaps.save();
  spells.save();
  executeData.save();
  dsa.save();
}

export function handleExecutors(event: LogFlippedExecutors): void {
  let id = "ALL"
  let executors_ = Executor.load(id);
  if(executors_ == null){
    executors_ = new Executor(id);
    executors_.executors = [];
  }
  let execArr = executors_.executors;
  let statusArr = event.params.status;
  for(let i=0;i<event.params.executors.length;i++){
    let index = execArr.indexOf(event.params.executors[i]);
    if(statusArr[i] === true){
      if(index == -1){
        execArr.push(event.params.executors[i]);
      }
    } else {
      if(index != -1){
        execArr.splice(index-1, 1);
      }
    }
  }
  executors_.executors = execArr;
  executors_.save();
}
