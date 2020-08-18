import { useWeb3Context } from 'contexts/Web3Context'
import React from 'react'
import { Redirect, Route, RouteProps, Switch } from 'react-router-dom'

import { ButtonConnect } from '../../components/buttons/ButtonConnect'
import { InfoCard } from '../../components/statusInfo/InfoCard'
import { InlineLoading } from '../../components/statusInfo/InlineLoading'
import { ConditionDetails } from '../ConditionDetails'
import { ConditionsList } from '../ConditionsList'
import { PositionDetails } from '../PositionDetails'
import { PositionsList } from '../PositionsList'
import { PrepareCondition } from '../PrepareCondition'
import { SplitPosition } from '../SplitPosition'
import { RedeemPositionContainer } from '../redeem-position'
import { ReportPayoutsContainer } from '../report-payouts'

const ProtectedRoute: React.FC<RouteProps> = (props) => {
  const { component, path } = props
  const { status } = useWeb3Context()

  return (
    <>
      {status._type === 'notAsked' && (
        <>
          <p>
            This should trigger the connection prompt automatically (it should not show the connect
            button)
          </p>
          <ButtonConnect style={{ flexGrow: 0, height: 'auto' }} />
        </>
      )}
      {status._type === 'connecting' && <InlineLoading />}
      {status._type === 'error' && (
        <InfoCard message="Error when trying to connect..." title="Error" />
      )}
      {status._type === 'connected' && <Route component={component} exact path={path} />}
    </>
  )
}

export const Routes: React.FC = () => {
  return (
    <Switch>
      <Route component={ConditionsList} exact path="/conditions" />
      <Route component={ConditionDetails} exact path="/conditions/:conditionId" />
      <Route component={PositionsList} exact path="/positions" />
      <Route component={PositionDetails} exact path="/positions/:positionId" />
      <ProtectedRoute component={PrepareCondition} path="/prepare" />
      <ProtectedRoute component={SplitPosition} path="/split" />
      <ProtectedRoute component={ReportPayoutsContainer} path="/report" />
      <ProtectedRoute component={RedeemPositionContainer} path="/redeem" />
      <Route exact path="/">
        <Redirect to="/conditions" />
      </Route>
      <Route path="*">
        <InfoCard message="Page not found..." title="Error 404" />
      </Route>
    </Switch>
  )
}