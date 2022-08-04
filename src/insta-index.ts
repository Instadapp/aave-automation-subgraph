import {
  Address,
  BigInt,
  Bytes,
  DataSourceContext,
} from "@graphprotocol/graph-ts";
import {
  InstaIndex,
  LogAccountCreated,
  LogNewAccount,
  LogNewCheck,
  LogNewMaster,
  LogUpdateMaster,
} from "../generated/InstaIndex/InstaIndex";
import { Account, ExecutionParams, SubmitData, Swap, Spell, ExecuteData, ExecuteMetaData, CancelData, SystemCancelData } from "../generated/schema";
import { InstaAutomation } from "../generated/InstaIndex/InstaAutomation";
import { InstaList } from "../generated/InstaIndex/InstaList";
import { InstaAutomation as InstaAutomationABI } from "../generated/templates";

export const ZERO = new BigInt(0);
export const ADDR_ZERO = new Address(0);

//loads or creates smart account
export function createOrLoadDsa(id: string): Account {
  let account = Account.load(id);
  if (account == null) {
    account = new Account(id);
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
    }
    return submitData;
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

export function createOrLoadSpell(id: string): Spell {
  let spell = Spell.load(id);
  if(spell == null){
    spell = new Spell(id);
    spell._datas = [];
    spell._targets = [];
  }
  return spell;
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
    data.spells = createOrLoadSpell(id).id;
  }
  return data;
}

export function createOrLoadExecuteMetaData(id: string): ExecuteMetaData {
  let data = ExecuteMetaData.load(id);
  if(data == null) {
    data = new ExecuteMetaData(id);
    data.user = ADDR_ZERO;
    data.userId = ZERO;
    data.nonce = ZERO;
    data.isSafe = false;
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
  }
  return data;
}
