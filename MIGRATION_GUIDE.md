# API Service Migration Guide

## Quick Reference

### Import Statement
Add this to the top of every component that makes API calls:

```javascript
import apiService from 'services/api';
```

### Remove These
- `const jwttoken = localStorage.getItem('jwtToken');` - No longer needed
- Direct `fetch()` calls
- Manual header construction
- `process.env.REACT_APP_BACKENDAPI` references

## Migration Patterns

### Pattern 1: Simple GET Request

**Before:**
```javascript
const jwttoken = localStorage.getItem('jwtToken');

const response = await fetch(
  `${process.env.REACT_APP_BACKENDAPI}/api/users`,
  {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${jwttoken}`,
    },
  }
);

if (!response.ok) {
  throw new Error(`HTTP error! status: ${response.status}`);
}

const data = await response.json();
```

**After:**
```javascript
const data = await apiService.getUsers();
```

### Pattern 2: POST Request with Body

**Before:**
```javascript
const response = await fetch(
  `${process.env.REACT_APP_BACKENDAPI}/api/strategy`,
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${jwttoken}`,
    },
    body: JSON.stringify(newStrategy),
  }
);

const data = await response.json();
```

**After:**
```javascript
const data = await apiService.createStrategy(newStrategy);
```

### Pattern 3: PUT Request

**Before:**
```javascript
await fetch(
  `${process.env.REACT_APP_BACKENDAPI}/api/strategy/${strategyId}`,
  {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwttoken}`,
    },
    body: JSON.stringify(updates),
  }
);
```

**After:**
```javascript
await apiService.updateStrategy(strategyId, updates);
```

### Pattern 4: DELETE Request

**Before:**
```javascript
const response = await fetch(
  `${process.env.REACT_APP_BACKENDAPI}/api/users/${id}`,
  {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${jwttoken}`,
    },
  }
);

if (response.ok) {
  // Success
}
```

**After:**
```javascript
await apiService.deleteUser(id);
// If no error is thrown, it succeeded
```

### Pattern 5: Error Handling

**Before:**
```javascript
try {
  const response = await fetch(url, options);
  
  if (!response.ok) {
    toast({
      title: 'Error',
      description: 'Something went wrong',
      status: 'error',
    });
  }
  
  const data = await response.json();
} catch (error) {
  console.error(error);
  toast({
    title: 'Error',
    description: 'Request failed',
    status: 'error',
  });
}
```

**After:**
```javascript
try {
  const data = await apiService.methodName(params);
  
  toast({
    title: 'Success',
    status: 'success',
  });
} catch (error) {
  toast({
    title: 'Error',
    description: error.message,
    status: 'error',
  });
}
```

## Complete API Service Methods

### Admin Routes
```javascript
apiService.adminSignIn(password)
apiService.adminSignUp(password)
```

### User Routes
```javascript
apiService.getUsers(signal?)
apiService.getUserById(id, signal?)
apiService.createUser(userData)
apiService.updateUser(id, userData)
apiService.deleteUser(id)
apiService.getUserSettings(id, signal?)
apiService.updateUserSettings(id, settings)
```

### Strategy Routes
```javascript
apiService.getStrategies(signal?)
apiService.getStrategyById(id, signal?)
apiService.createStrategy(strategyData)
apiService.updateStrategy(id, strategyData)
apiService.deleteStrategy(id)
apiService.linkStrategyToUser(userId, strategyId)
apiService.unlinkStrategyFromUser(userId, strategyId)
apiService.getStrategyUsers(strategyId, signal?)
```

### Trading Pairs Routes
```javascript
apiService.getTradingPairs(signal?)
apiService.getSavedTradingPairs(signal?)
apiService.updateTradingPairSelection(id, selected)
```

### Binance Routes
```javascript
apiService.getBinancePastTrades(signal?)
apiService.getBinanceExchangeInfo(userId, signal?)
apiService.validateBinanceCredentials(userId, signal?)
apiService.closePosition(userId, symbol)
```

### Logs Routes
```javascript
apiService.getLogs(page?, limit?, signal?)
```

### Webhook
```javascript
apiService.getTradingViewWebhookUrl()
```

## Performance Optimizations

### 1. Wrap Components in React.memo

**Before:**
```javascript
const MyComponent = ({ prop1, prop2 }) => {
  // Component code
};

export default MyComponent;
```

**After:**
```javascript
const MyComponent = React.memo(({ prop1, prop2 }) => {
  // Component code
});

export default MyComponent;
```

### 2. Use useCallback for Event Handlers

**Before:**
```javascript
const handleClick = () => {
  // Handler code
};
```

**After:**
```javascript
const handleClick = useCallback(() => {
  // Handler code
}, [dependencies]);
```

### 3. Use useMemo for Expensive Computations

**Before:**
```javascript
const tradingViewLink = `${process.env.REACT_APP_BACKENDAPI}/api/tradingview-webhook`;
```

**After:**
```javascript
const tradingViewLink = useMemo(
  () => apiService.getTradingViewWebhookUrl(),
  []
);
```

### 4. Add Loading States

**Before:**
```javascript
<Button onClick={handleSubmit}>
  Submit
</Button>
```

**After:**
```javascript
const [isSubmitting, setIsSubmitting] = useState(false);

const handleSubmit = async () => {
  setIsSubmitting(true);
  try {
    await apiService.methodName();
  } finally {
    setIsSubmitting(false);
  }
};

<Button 
  onClick={handleSubmit}
  isLoading={isSubmitting}
  loadingText="Submitting..."
>
  Submit
</Button>
```

## Component-Specific Migrations

### Remaining Components to Migrate

1. **usersettings.js** - User settings management
2. **Transfer.js** - Transfer operations
3. **Tradehistory.js** - Trade history display
4. **PositionsTable.js** - Position management
5. **tradingpair.js** - Trading pair selection
6. **logger.js** - Logging (WebSocket)
7. **editstrategy.js** - Strategy editing (large component)
8. **tradehook.js** - Trading hook trigger
9. **index.jsx** (main dashboard) - Multiple API calls

### Migration Checklist for Each Component

- [ ] Import apiService
- [ ] Remove jwttoken variable
- [ ] Replace all fetch calls with apiService methods
- [ ] Add useCallback to event handlers
- [ ] Add useMemo for computed values
- [ ] Wrap component in React.memo
- [ ] Add loading states to buttons
- [ ] Update error handling to use error.message
- [ ] Remove jwttoken from props
- [ ] Test the component

## Testing After Migration

### 1. Verify API Calls Work
```javascript
// In browser console
localStorage.getItem('jwtToken') // Should return token
```

### 2. Check Network Tab
- All requests should have Authorization header
- Requests should go to correct endpoints
- Error responses should be handled

### 3. Test Error Scenarios
- Invalid token (should redirect to login)
- Network errors (should show toast)
- Validation errors (should show specific message)

### 4. Test Loading States
- Buttons should show loading spinner
- Buttons should be disabled while loading
- Multiple clicks should not trigger multiple requests

## Common Issues and Solutions

### Issue 1: "apiService is not defined"
**Solution:** Add import statement:
```javascript
import apiService from 'services/api';
```

### Issue 2: "Cannot read property 'message' of undefined"
**Solution:** API service always throws objects with message property. Check error handling:
```javascript
catch (error) {
  console.log(error.message); // Always available
}
```

### Issue 3: Component re-renders too often
**Solution:** 
- Wrap component in React.memo
- Use useCallback for functions
- Use useMemo for computed values

### Issue 4: Request not cancelled on unmount
**Solution:** Use AbortController (already handled in apiService):
```javascript
const controller = apiService.createAbortController('myRequest');
await apiService.getUsers(controller.signal);
```

## Best Practices

1. **Always handle errors**
   ```javascript
   try {
     await apiService.method();
   } catch (error) {
     // Handle error
   }
   ```

2. **Use loading states**
   ```javascript
   const [loading, setLoading] = useState(false);
   ```

3. **Show user feedback**
   ```javascript
   toast({
     title: 'Success',
     status: 'success',
   });
   ```

4. **Validate input before API call**
   ```javascript
   if (!isValid) return;
   await apiService.method();
   ```

5. **Clean up on unmount**
   ```javascript
   useEffect(() => {
     return () => {
       apiService.cancelRequest('myRequest');
     };
   }, []);
   ```

## Example: Complete Component Migration

**Before:**
```javascript
import React, { useState } from 'react';
import { Button, useToast } from '@chakra-ui/react';

const MyComponent = ({ jwttoken }) => {
  const toast = useToast();
  const [data, setData] = useState([]);

  const fetchData = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKENDAPI}/api/users`,
        {
          headers: {
            Authorization: `Bearer ${jwttoken}`,
          },
        }
      );
      
      if (!response.ok) {
        throw new Error('Failed');
      }
      
      const result = await response.json();
      setData(result);
    } catch (error) {
      toast({
        title: 'Error',
        status: 'error',
      });
    }
  };

  return <Button onClick={fetchData}>Fetch</Button>;
};

export default MyComponent;
```

**After:**
```javascript
import React, { useState, useCallback } from 'react';
import { Button, useToast } from '@chakra-ui/react';
import apiService from 'services/api';

const MyComponent = React.memo(() => {
  const toast = useToast();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    
    try {
      const result = await apiService.getUsers();
      setData(result);
      
      toast({
        title: 'Data loaded successfully',
        status: 'success',
      });
    } catch (error) {
      toast({
        title: 'Error loading data',
        description: error.message,
        status: 'error',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  return (
    <Button 
      onClick={fetchData}
      isLoading={loading}
      loadingText="Loading..."
    >
      Fetch
    </Button>
  );
});

export default MyComponent;
```

## Summary

✅ **Benefits of Migration:**
- Cleaner code
- Consistent error handling
- Better performance
- Easier testing
- Centralized API logic
- Automatic token management
- Request cancellation support

✅ **What to Remove:**
- Direct fetch calls
- Manual header construction
- JWT token prop drilling
- Duplicate error handling
- Environment variable references

✅ **What to Add:**
- apiService import
- React.memo wrapper
- useCallback hooks
- useMemo hooks
- Loading states
- Better error messages

---

**Need Help?** Check the completed components for reference:
- `src/views/auth/signIn/index.jsx`
- `src/views/admin/default/components/createstrategy.js`
- `src/views/admin/default/components/strategylist.js`
- `src/views/admin/default/components/strategydelete.js`
- `src/views/admin/default/components/userdelete.js`
- `src/views/admin/default/components/adduser.js`
