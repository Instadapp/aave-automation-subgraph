# AAVE Automation Subgraph

Tracks the data related to Submit, Execute and Cancel automation.

Subgraph deployment:

- Polygon: [https://thegraph.com/hosted-service/subgraph/richa-iitr/aave-automation-polygon?selected=playground](https://thegraph.com/hosted-service/subgraph/richa-iitr/aave-automation-polygon?selected=playground)

Query Structure

<pre>
{
  accounts{
    id
    submitAutomation{
      id
      user
      userId
      safeHF
      thresholdHF
      currentHf
    }
    executeMetaData{
      id
      isSafe
      metadata
    }
    executeAutomation{
      id
      finalHf
      initialHf
      automationFee
      params{
        id
        collateralToken
        debtToken
        collateralAmount
        debtAmount
        collateralAmountWithTotalFee
        swap{
          id
          buyToken
          sellToken
          sellAmt
          unitAmt
          callData
        }
        route
        rateMode
      }
      spells{
        id
        _targets
        _datas
      }
    }
    cancelData{
      id
      user
      userId
      nonce
    }
    systemCancelData{
      id
      userId
      user
      nonce
      errorCode
    }
  }
  executors{
    id
    executors
  }
}

</pre>
