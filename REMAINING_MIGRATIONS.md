# Remaining Component Migrations

## Completed Migrations (8/15)

✅ SignIn - Complete
✅ CreateStrategy - Complete  
✅ StrategiesList - Complete
✅ StrategyDelete - Complete
✅ UserDelete - Complete
✅ AddUser - Complete
✅ UserSettings - Complete
✅ TradingPairs - Complete

## Remaining Components (7/15)

### Simple Components (Can be migrated quickly)

#### 1. Transfer.js (206 lines)
**API Calls to Replace:**
- None visible in initial scan - may use WebSocket or parent props

#### 2. tradehook.js
**API Calls to Replace:**
- Webhook trigger endpoint

#### 3. logger.js (204 lines)
**Special Case: WebSocket**
- Uses WebSocket connection
- Needs special handling for real-time logs
- API call: GET /api/logs for initial load

### Medium Complexity

#### 4. PositionsTable.js (345 lines)
**API Calls to Replace:**
- Close position: POST /api/binance/close-position/:userId/:symbol
- Already handled in parent (index.jsx)

#### 5. Tradehistory.js (355 lines)
**API Calls to Replace:**
- GET /api/binance/all-past-trades
- Already handled in parent (index.jsx)

### Large Components (Need Refactoring)

#### 6. editstrategy.js (823 lines) - PRIORITY
**API Calls to Replace:**
- GET /api/strategy/:id
- PUT /api/strategy/:id
- GET /api/strategies/:strategyId/users
- POST /api/users/:userId/strategies/:strategyId
- DELETE /api/users/:userId/strategies/:strategyId

**Refactoring Needed:**
- Split into smaller components
- Extract form sections
- Separate user linking logic
- Use useReducer for complex state

#### 7. index.jsx (Main Dashboard - 959 lines) - CRITICAL
**API Calls to Replace:**
- GET /api/users
- DELETE /api/users/:id
- GET /api/binance/all-past-trades
- POST /api/binance/close-position/:userId/:symbol
- GET /api/binance/valid/:userId
- GET /api/binance/all-exchange-info/:userId

**Refactoring Needed:**
- Split into section components:
  - StatisticsSection
  - UsersSection
  - PositionsSection
  - ActionsSection
- Extract business logic to custom hooks
- Use useReducer for complex state
- Separate API calls into custom hooks

## Migration Strategy

### Phase 1: Quick Wins (2-4 hours)
1. ✅ UserSettings - DONE
2. ✅ TradingPairs - DONE
3. Transfer.js (if has API calls)
4. tradehook.js

### Phase 2: Medium Components (4-6 hours)
5. PositionsTable.js
6. Tradehistory.js
7. logger.js (WebSocket special handling)

### Phase 3: Large Components (16-24 hours)
8. editstrategy.js - Split and refactor
9. index.jsx - Split and refactor

## Quick Migration Template

For simple components, follow this pattern:

```javascript
// 1. Add imports
import apiService from 'services/api';
import { useCallback, useState } from 'react';

// 2. Wrap in React.memo
const Component = React.memo(({ props }) => {
  const [loading, setLoading] = useState(false);
  
  // 3. Replace fetch with apiService
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiService.methodName();
      // Handle data
    } catch (error) {
      // Handle error
    } finally {
      setLoading(false);
    }
  }, [dependencies]);
  
  // 4. Add loading states to buttons
  return (
    <Button isLoading={loading} onClick={fetchData}>
      Action
    </Button>
  );
});
```

## Testing Checklist

For each migrated component:
- [ ] Import apiService
- [ ] Remove jwttoken references
- [ ] Replace all fetch calls
- [ ] Add loading states
- [ ] Add error handling
- [ ] Test in browser
- [ ] Verify API calls work
- [ ] Check error scenarios

## Notes

- Most components receive data from parent (index.jsx)
- PositionsTable and Tradehistory may not need migration if they only display data
- Focus on index.jsx and editstrategy.js as they have the most API calls
- Logger.js needs special WebSocket handling
