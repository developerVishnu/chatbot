Welcome to your new TanStack app! 

# Getting Started

To run this application:

```bash
npm install
npm run start
```

# Building For Production

To build this application for production:

```bash
npm run build
```

## Testing

This project uses [Vitest](https://vitest.dev/) for testing. You can run the tests with:

```bash
npm run test
```

## Styling

This project uses [Tailwind CSS](https://tailwindcss.com/) for styling.


## Linting & Formatting

This project uses [Biome](https://biomejs.dev/) for linting and formatting. The following scripts are available:


```bash
npm run lint
npm run format
npm run check
```



## Routing
This project uses [TanStack Router](https://tanstack.com/router). The initial setup is a file based router. Which means that the routes are managed as files in `src/routes`.

### Adding A Route

To add a new route to your application just add another a new file in the `./src/routes` directory.

TanStack will automatically generate the content of the route file for you.

Now that you have two routes you can use a `Link` component to navigate between them.

### Adding Links

To use SPA (Single Page Application) navigation you will need to import the `Link` component from `@tanstack/react-router`.

```tsx
import { Link } from "@tanstack/react-router";
```

Then anywhere in your JSX you can use it like so:

```tsx
<Link to="/about">About</Link>
```

This will create a link that will navigate to the `/about` route.

More information on the `Link` component can be found in the [Link documentation](https://tanstack.com/router/v1/docs/framework/react/api/router/linkComponent).

### Using A Layout

In the File Based Routing setup the layout is located in `src/routes/__root.tsx`. Anything you add to the root route will appear in all the routes. The route content will appear in the JSX where you use the `<Outlet />` component.

Here is an example layout that includes a header:

```tsx
import { Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

import { Link } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: () => (
    <>
      <header>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
        </nav>
      </header>
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
})
```

The `<TanStackRouterDevtools />` component is not required so you can remove it if you don't want it in your layout.

More information on layouts can be found in the [Layouts documentation](https://tanstack.com/router/latest/docs/framework/react/guide/routing-concepts#layouts).


## Data Fetching

There are multiple ways to fetch data in your application. You can use TanStack Query to fetch data from a server. But you can also use the `loader` functionality built into TanStack Router to load the data for a route before it's rendered.

For example:

```tsx
const peopleRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/people",
  loader: async () => {
    const response = await fetch("https://swapi.dev/api/people");
    return response.json() as Promise<{
      results: {
        name: string;
      }[];
    }>;
  },
  component: () => {
    const data = peopleRoute.useLoaderData();
    return (
      <ul>
        {data.results.map((person) => (
          <li key={person.name}>{person.name}</li>
        ))}
      </ul>
    );
  },
});
```

Loaders simplify your data fetching logic dramatically. Check out more information in the [Loader documentation](https://tanstack.com/router/latest/docs/framework/react/guide/data-loading#loader-parameters).

### React-Query

React-Query is an excellent addition or alternative to route loading and integrating it into you application is a breeze.

First add your dependencies:

```bash
npm install @tanstack/react-query @tanstack/react-query-devtools
```

Next we'll need to create a query client and provider. We recommend putting those in `main.tsx`.

```tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// ...

const queryClient = new QueryClient();

// ...

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);

  root.render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
```

You can also add TanStack Query Devtools to the root route (optional).

```tsx
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const rootRoute = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <ReactQueryDevtools buttonPosition="top-right" />
      <TanStackRouterDevtools />
    </>
  ),
});
```

Now you can use `useQuery` to fetch your data.

```tsx
import { useQuery } from "@tanstack/react-query";

import "./App.css";

function App() {
  const { data } = useQuery({
    queryKey: ["people"],
    queryFn: () =>
      fetch("https://swapi.dev/api/people")
        .then((res) => res.json())
        .then((data) => data.results as { name: string }[]),
    initialData: [],
  });

  return (
    <div>
      <ul>
        {data.map((person) => (
          <li key={person.name}>{person.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
```

You can find out everything you need to know on how to use React-Query in the [React-Query documentation](https://tanstack.com/query/latest/docs/framework/react/overview).

## State Management

Another common requirement for React applications is state management. There are many options for state management in React. TanStack Store provides a great starting point for your project.

First you need to add TanStack Store as a dependency:

```bash
npm install @tanstack/store
```

Now let's create a simple counter in the `src/App.tsx` file as a demonstration.

```tsx
import { useStore } from "@tanstack/react-store";
import { Store } from "@tanstack/store";
import "./App.css";

const countStore = new Store(0);

function App() {
  const count = useStore(countStore);
  return (
    <div>
      <button onClick={() => countStore.setState((n) => n + 1)}>
        Increment - {count}
      </button>
    </div>
  );
}

export default App;
```

One of the many nice features of TanStack Store is the ability to derive state from other state. That derived state will update when the base state updates.

Let's check this out by doubling the count using derived state.

```tsx
import { useStore } from "@tanstack/react-store";
import { Store, Derived } from "@tanstack/store";
import "./App.css";

const countStore = new Store(0);

const doubledStore = new Derived({
  fn: () => countStore.state * 2,
  deps: [countStore],
});
doubledStore.mount();

function App() {
  const count = useStore(countStore);
  const doubledCount = useStore(doubledStore);

  return (
    <div>
      <button onClick={() => countStore.setState((n) => n + 1)}>
        Increment - {count}
      </button>
      <div>Doubled - {doubledCount}</div>
    </div>
  );
}

export default App;
```

We use the `Derived` class to create a new store that is derived from another store. The `Derived` class has a `mount` method that will start the derived store updating.

Once we've created the derived store we can use it in the `App` component just like we would any other store using the `useStore` hook.

You can find out everything you need to know on how to use TanStack Store in the [TanStack Store documentation](https://tanstack.com/store/latest).

# Demo files

Files prefixed with `demo` can be safely deleted. They are there to provide a starting point for you to play around with the features you've installed.

# Learn More

You can learn more about all of the offerings from TanStack in the [TanStack documentation](https://tanstack.com).
export const validateShipmentData = (shipmentDetailsELC: any) => {
  const errorMsg:any=[];
  const partialShipment = shipmentDetailsELC?.partialShipment?.value || shipmentDetailsELC?.partialShipment;
  if (!partialShipment) {
    errorMsg.push({ "section": "Shipment Details", "field": "Partial Shipment", "errorDescription": "Partial Shipment is mandatory" });
  }
  const transhipment = shipmentDetailsELC?.transhipment?.value || shipmentDetailsELC?.transhipment;
  if (!transhipment) {
    errorMsg.push({ "section": "Shipment Details", "field": "Transhipment", "errorDescription": "Transhipment is mandatory" });
  }
  const periodForPresentationInDays = shipmentDetailsELC?.periodForPresentationInDays?.value || shipmentDetailsELC?.periodForPresentationInDays;
  if (!periodForPresentationInDays) {
    errorMsg.push({ "section": "Shipment Details", "field": "Period for Presentation in Days", "errorDescription": "Period for Presentation in Days is mandatory" });
  }
  if (Number.isNaN(Number(periodForPresentationInDays))) {
    errorMsg.push({ "section": "Shipment Details", "field": "Period for Presentation in Days", "errorDescription": "Period for Presentation in Days value has invalid Character" })
  }
  if (!Number.isNaN(Number(periodForPresentationInDays)) && (Number(periodForPresentationInDays) < 0 || Number(periodForPresentationInDays) > 999)) {
    errorMsg.push({ "section": "Shipment Details", "field": "Period for Presentation in Days", "errorDescription": "Period for Presentation in Days most not have more than 3 characters" })
  } else if (!Number.isInteger(Number(periodForPresentationInDays))) {
    errorMsg.push({ "section": "Shipment Details", "field": "Period for Presentation in Days", "errorDescription": "Period for Presentation in Days value has invalid Character" })
  }
  const incotermYear = shipmentDetailsELC?.incotermYear?.value || shipmentDetailsELC?.incotermYear;
  if (!incotermYear) {
    errorMsg.push({ "section": "Shipment Details", "field": "incotermYear", "errorDescription": "incotermYear is mandatory" });
  }
  const modeOfShipment = shipmentDetailsELC?.modeOfShipment?.value || shipmentDetailsELC?.modeOfShipment;
  if (!modeOfShipment) {
    errorMsg.push({ "section": "Shipment Details", "field": "modeOfShipment", "errorDescription": "modeOfShipment is mandatory" });
  }
  return errorMsg;
}
import { LOCVariable } from '@components/TransactionWorkDeskDetails/screens/LetterOfCreditDetails/service';
import { get } from 'lodash';

const patternX = "^[a-zA-Z0-9/?:().'+,\r\n -]+$";
const patternZ = '^[A-Za-z0-9.,()/=\'+:?!"%&*<>;{@#_\r\n -]*$';
const validatePatternX = new RegExp(patternX);
const validatePatternZ = new RegExp(patternZ);

export const validation = (payload) => {
  const errors = [];
  const customPayload = {
    isBeneficiaryChangedReq: false,
    step: 'new',
  };
  for (const rule of validationRules) {
    if (rule.setp && !rule.setp.includes(customPayload.step)) {
      continue;
    }
    const value = get(payload, rule.path);
    if (rule?.customValidator) {
      const customValidator = rule?.customValidator(value, payload, customPayload);
      if (customValidator) {
        errors.push({
          section: rule.section,
          field: rule.field ? rule.field : LOCVariable[rule.path],
          errorDescription:
            typeof customValidator === 'boolean'
              ? `${rule.field ? rule.field : LOCVariable[rule.path]} is mandatory`
              : customValidator,
        });
      }
    }
    if (rule.required) {
      if (value === null || value === undefined || value === '') {
        errors.push({
          section: rule.section,
          field: rule.field ? rule.field : LOCVariable[rule.path],
          errorDescription: `${rule.field ? rule.field : LOCVariable[rule.path]} is mandatory`,
        });
      }
    }
  }

  return errors;
};

interface IInterfaceCustomPayload {
  isBeneficiaryChangedReq: boolean;
}

interface IValidationRules {
  path: string;
  required?: boolean;
  internalName?: string;
  section: string;
  field?: string;
  setp?: string[]; // Validate only on this steps if null or undefined validate on all steps
  // Need to return error message or null if valid
  customValidator?: (value: any, payload: any, customPayload: IInterfaceCustomPayload) => string | null | boolean;
}

export const validationRules: IValidationRules[] = [
  // ***** letter Of Credit Header Details ILC ***** //
  {
    path: 'letterOfCreditHeaderDetailsILC.letterOfCreditType',
    required: true,
    internalName: 'letterOfCreditType',
    section: 'Letter of Credit Details',
    field: 'letter Of Credit Type',
  },
  {
    path: 'letterOfCreditHeaderDetailsILC.letterOfCreditbeneficiary',
    required: true,
    internalName: 'letterOfCreditbeneficiary',
    section: 'Letter of Credit Details',
    field: 'letter Of Credit beneficiary',
  },
  {
    path: 'letterOfCreditHeaderDetailsILC.letterOfCreditAmount.currency.value',
    required: true,
    internalName: 'letterOfCreditAmount',
    section: 'Letter of Credit Details',
    field: 'letter Of Credit Amount',
  },
  {
    path: 'letterOfCreditHeaderDetailsILC.expiryDate',
    required: true,
    internalName: 'expiryDate',
    section: 'Letter of Credit Details',
    field: 'Expiry Date',
  },

  // ***** Amendment Details ***** //
  {
    path: 'amendmentDetails.numberOfAmendment.value',
    required: true,
    section: 'Amendment Data',
    setp: ['amd'],
  },
  {
    path: 'amendmentDetails.purposeOfMessage.value',
    required: true,
    section: 'Amendment Data',
    setp: ['amd'],
  },
  {
    path: 'amendmentDetails.dateOfAmendment.value',
    required: true,
    section: 'Amendment Data',
    setp: ['amd'],
  },
  {
    path: 'amendmentDetails.natureOfBeneficiaryChange.value',
    section: 'Amendment Data',
    setp: ['amd'],
    customValidator: (value, _, customPayload) => {
      return customPayload?.isBeneficiaryChangedReq ? (value ? null : true) : null;
    },
  },
  {
    path: 'amendmentDetails',
    section: 'Amendment Data',
    field: 'Increase in Amount/ Decrease in Amount',
    setp: ['amd'],
    customValidator: (value) => {
      const isAmount =
        get(value, 'increaseInAmount.currency.value') &&
        get(value, 'increaseInAmount.formattedValue.value') &&
        get(value, 'decreaseInAmount.currency.value') &&
        get(value, 'decreaseInAmount.formattedValue.value');
      return isAmount ? 'Please fill only one field: either Increase or Decrease, but not both' : null;
    },
  },

  // ***** Internal Data ***** //
  {
    path: 'internalDataDetailsILC.letterOfCreditType.value',
    required: true,
    section: 'Internal Data',
  },
  {
    path: 'internalDataDetailsILC.ourLEID.value',
    required: true,
    section: 'Internal Data',
  },
  {
    path: 'internalDataDetailsILC.letterOfCreditNumber.value',
    required: true,
    section: 'Internal Data',
  },
  {
    path: 'internalDataDetailsILC.deliveryMode.value',
    required: true,
    section: 'Internal Data',
  },

  // ***** General LC Details ***** //
  {
    path: 'generalILCDetails.draftDraweeDetailsMolecule.value',
    section: 'General LC Details',
    customValidator: (value, payload) => {
      return payload?.generalILCDetails?.draftDrawnOnDrawee?.value == 'OTHR' ? true : null;
    },
  },
  {
    path: 'generalILCDetails.availableWithBankDetails.value',
    section: 'General LC Details',
    customValidator: (value, payload) => {
      return payload?.generalILCDetails?.availableWith?.value == 'OTHR' ? true : null;
    },
  },
  {
    path: 'generalILCDetails.usanceTenorInDays.value',
    section: 'General LC Details',
    customValidator: (value, payload) => {
      return payload?.generalILCDetails?.tenorType?.value == 'OTHR' ||
        payload?.generalILCDetails?.availableBy?.value == 'BACP' ||
        payload?.generalILCDetails?.availableBy?.value == 'BDEF'
        ? true
        : null;
    },
  },
  {
    path: 'generalILCDetails.usancePeriod.value',
    section: 'General LC Details',
    customValidator: (value, payload) => {
      return payload?.generalILCDetails?.tenorType?.value == 'USAN' ||
        payload?.generalILCDetails?.availableBy?.value == 'BACP' ||
        payload?.generalILCDetails?.availableBy?.value == 'BDEF'
        ? true
        : null;
    },
  },
  {
    path: 'generalILCDetails.mixedPaymentDetails.value',
    section: 'General LC Details',
    customValidator: (value, payload) => {
      return payload?.generalILCDetails?.tenorType?.value == 'MIXD' ||
        payload?.generalILCDetails?.availableBy?.value == 'BMXP'
        ? true
        : null;
    },
  },
  {
    path: 'generalILCDetails.applicableRulesNarrative.value',
    section: 'General LC Details',
    customValidator: (value, payload) => {
      return payload?.generalILCDetails?.applicableRules?.value === 'OTHR' ? true : null;
    },
  },
  {
    path: 'generalILCDetails.usancePeriodOthers.value',
    section: 'General LC Details',
    customValidator: (value, payload) => {
      return payload?.generalILCDetails?.usancePeriod?.value === 'OTHR' ? true : null;
    },
  },
  {
    path: 'generalILCDetails.letterOfCreditExpiryPlaceOthers.value',
    section: 'General LC Details',
    customValidator: (value, payload) => {
      return payload?.generalILCDetails?.letterOfCreditExpiryPlace?.value === 'OTHR' ? true : null;
    },
  },
  {
    path: 'generalILCDetails.additionalAmounts.currency.value',
    section: 'General LC Details',
    customValidator: (value, payload) => {
      return (Array.isArray(payload?.generalILCDetails?.additionalAmountCovered) &&
        payload?.generalILCDetails?.additionalAmountCovered?.[0]) ||
        payload?.additionalAmountCovered?.value
        ? true
        : null;
    },
  },
  {
    path: 'generalILCDetails.additionalAmountCovered.value',
    section: 'General LC Details',
    customValidator: (value, payload) => {
      return payload?.generalILCDetails?.additionalAmounts?.formattedValue?.value ? true : null;
    },
  },
  {
    path: 'generalILCDetails.ttReimbursementAllowed.value',
    section: 'General LC Details',
    customValidator: (value, payload) => {
      return payload?.generalILCDetails?.reimbursementInstruction?.value === 'ALLD' ? true : null;
    },
  },
  {
    path: 'generalILCDetails.claimValueDays.value',
    section: 'General LC Details',
    customValidator: (value, payload) => {
      return payload?.generalILCDetails?.ttReimbursementAllowed?.value ? true : null;
    },
  },
  {
    path: 'generalILCDetails.letterOfCreditExpiryPlaceOthers.value',
    section: 'General LC Details',
    required: true,
  },
  {
    path: 'generalILCDetails.letterOfCreditExpiryDate.value',
    section: 'General LC Details',
    customValidator: (value, payload) => {
      const today = new Date();
      const minDate = today.toISOString().split('T')[0];
      return payload?.generalILCDetails?.letterOfCreditExpiryDate?.value < minDate
        ? 'The LC expiry date must be later than current system date'
        : null;
    },
  },
  {
    path: 'generalILCDetails?.letterOfCreditAmount?.formattedValue?.value',
    section: 'General LC Details',
    customValidator: (value, payload) => {
      return payload?.generalILCDetails?.letterOfCreditAmount?.currency?.value &&
        payload?.generalILCDetails?.letterOfCreditAmount?.formattedValue?.value
        ? null
        : `${
            payload?.generalILCDetails?.letterOfCreditAmount?.currency?.value ? 'Amount' : 'Currency'
          } field cannot be empty when the currency is selected`;
    },
  },
  {
    path: 'generalILCDetails?.additionalAmounts?.formattedValue?.value',
    section: 'General LC Details',
    customValidator: (value, payload) => {
      return payload?.generalILCDetails?.letterOfCreditAmount?.currency?.value &&
        payload?.generalILCDetails?.letterOfCreditAmount?.formattedValue?.value
        ? payload?.generalILCDetails?.letterOfCreditAmount?.currency?.value !=
          payload?.generalILCDetails?.additionalAmounts?.currency?.value
          ? 'Currency Mismatch with the Original LC amount'
          : null
        : `${
            payload?.generalILCDetails?.letterOfCreditAmount?.currency?.value ? 'Amount' : 'Currency'
          } field cannot be empty when the currency is selected`;
    },
  },
  // TODO: showError, showlcAmountError
  {
    path: 'generalILCDetails?.commodityTolerancePercentage?.value',
    section: 'General LC Details',
    customValidator: (value, payload) => {
      return !payload?.generalILCDetails?.positiveTolerance?.value &&
        payload?.generalILCDetails?.commodityToleranceApplicablity?.value &&
        !payload?.generalILCDetails?.commodityTolerancePercentage?.value
        ? 'Since Commodity Tolerance Applicability is set to "yes" and there is no Positive Tolerance, Commodity Tolerance cannot be left empty'
        : null;
    },
  },
  {
    path: 'generalILCDetails?.availableWithBICCode?.value',
    section: 'General LC Details',
    customValidator: (value, payload) => {
      return !payload?.generalILCDetails?.availableWithBICCode?.value &&
        !payload?.generalILCDetails?.availableWith?.value
        ? 'Input Available With-BIC or Available With-Free Text'
        : null;
    },
  },
  {
    path: 'generalILCDetails?.availableWith?.value',
    section: 'General LC Details',
    customValidator: (value, payload) => {
      return !payload?.generalILCDetails?.availableWithBICCode?.value &&
        !payload?.generalILCDetails?.availableWith?.value
        ? 'Input Available With-BIC or Available With-Free Text'
        : null;
    },
  },
  {
    path: 'generalILCDetails?.draftDrawnOnDraweeBICCode?.value',
    section: 'General LC Details',
    customValidator: (value, payload) => {
      return !!payload?.generalILCDetails?.draftRequired?.value &&
        !payload?.generalILCDetails?.draftDrawnOnDraweeBICCode?.value &&
        !payload?.generalILCDetails?.draftDrawnOnDrawee?.value
        ? 'Input Draft Drawn on Drawee-BIC or Draft Drawn on Drawee-Free Text'
        : null;
    },
  },
  {
    path: 'generalILCDetails?.draftDrawnOnDrawee?.value',
    section: 'General LC Details',
    customValidator: (value, payload) => {
      return !!payload?.generalILCDetails?.draftRequired?.value &&
        !payload?.generalILCDetails?.draftDrawnOnDraweeBICCode?.value &&
        !payload?.generalILCDetails?.draftDrawnOnDrawee?.value
        ? 'Input Draft Drawn on Drawee-BIC or Draft Drawn on Drawee-Free Text'
        : null;
    },
  },
  // TODO:draftAtNegotiationError

  // **** Document Required **** //
  {
    path: 'documentsRequiredILC?.letterOfIndemnityandWarrantyOfTitle?.value',
    section: 'General LC Details',
    required: true,
  },
  {
    path: 'documentsRequiredILC?.overrideDocumentsRequired?.value',
    section: 'General LC Details',
    customValidator: (value, payload) => {
      let data =
        payload?.documentsRequiredILC?.overrideDocumentsRequired?.value ||
        payload?.documentsRequiredILC?.overrideDocumentsRequired;
      return typeof data !== 'object' && !validatePatternZ.test(data)
        ? 'Documents Required must not contain invalid character'
        : null;
    },
  },

  {
    path: 'goodsDescriptionELC?.overrideGoodsDescription?.value',
    section: 'General LC Details',
    customValidator: (value, payload) => {
      let data =
        payload?.goodsDescriptionELC?.overrideGoodsDescription?.value ||
        payload?.goodsDescriptionELC?.overrideGoodsDescription;
      return typeof data !== 'object' && !validatePatternZ.test(data)
        ? 'Goods Description must not contain invalid character'
        : null;
    },
  },

  // **** Other Terms and Condition **** //

  {
    path: 'otherTermsAndConditionsILC?.chargesBorneBy?.value',
    section: 'Other Terms & Cond.',
    customValidator: (value, payload) => {
      const clinentSpecifiedCharges = payload?.otherTermsAndConditionsILC?.clientSpecifiedCharges?.value;
      const confirmationInstructions = payload?.generalILCDetails?.confirmationInstructions?.value;
      return ['OTHR', 'ACOA', 'ACOB', 'ACAA', 'ACBB', 'DCIR'].includes(clinentSpecifiedCharges) ||
        (clinentSpecifiedCharges === 'ACOA' &&
          (confirmationInstructions === 'WOUT' || confirmationInstructions === 'MADD'))
        ? null
        : !!value;
    },
  },
  {
    path: 'otherTermsAndConditionsILC?.chargesNarrative?.value',
    section: 'Other Terms & Cond.',
    required: true,
  },
  {
    path: 'otherTermsAndConditionsILC?.advisingCharges?.value',
    section: 'Other Terms & Cond.',
    customValidator: (value, payload) => {
      const clinentSpecifiedCharges = payload?.otherTermsAndConditionsILC?.clientSpecifiedCharges?.value;
      const confirmationInstructions = payload?.generalILCDetails?.confirmationInstructions?.value;
      return clinentSpecifiedCharges === 'ACOA' &&
        (confirmationInstructions === 'WOUT' || confirmationInstructions === 'MADD')
        ? null
        : !!value;
    },
  },
  {
    path: 'otherTermsAndConditionsILC?.reimbursementAndRemittanceCharges?.value',
    section: 'Other Terms & Cond.',
    customValidator: (value, payload) => {
      const clinentSpecifiedCharges = payload?.otherTermsAndConditionsILC?.clientSpecifiedCharges?.value;
      const confirmationInstructions = payload?.generalILCDetails?.confirmationInstructions?.value;
      return (clinentSpecifiedCharges === 'ACOA' &&
        (confirmationInstructions === 'WOUT' || confirmationInstructions === 'MADD')) ||
        clinentSpecifiedCharges === 'ACIC' ||
        confirmationInstructions === 'WOUT' ||
        confirmationInstructions === 'MADD'
        ? null
        : !!value;
    },
  },

  {
    path: 'otherTermsAndConditionsILC?.reimbursementAndRemittanceCharges?.value',
    section: 'Other Terms & Cond.',
    customValidator: (value, payload) => {
      const clinentSpecifiedCharges = payload?.otherTermsAndConditionsILC?.clientSpecifiedCharges?.value;
      const confirmationInstructions = payload?.generalILCDetails?.confirmationInstructions?.value;
      const reimbursementIntruction = payload?.generalILCDetails?.reimbursementInstruction?.value;
      return (clinentSpecifiedCharges === 'ACOA' &&
        (confirmationInstructions === 'WOUT' || confirmationInstructions === 'MADD')) ||
        clinentSpecifiedCharges === 'ACIC' ||
        reimbursementIntruction === 'ALLD'
        ? null
        : !!value;
    },
  },
  {
    path: 'otherTermsAndConditionsILC?.discrepancyCharges?.value',
    section: 'Other Terms & Cond.',
    customValidator: (value, payload) => {
      const clinentSpecifiedCharges = payload?.otherTermsAndConditionsILC?.clientSpecifiedCharges?.value;
      const confirmationInstructions = payload?.generalILCDetails?.confirmationInstructions?.value;
      return (clinentSpecifiedCharges === 'ACOA' &&
        (confirmationInstructions === 'WOUT' || confirmationInstructions === 'MADD')) ||
        clinentSpecifiedCharges === 'ACIC'
        ? null
        : !!value;
    },
  },
  {
    path: 'otherTermsAndConditionsILC?.reimbursingBankCharges?.value',
    section: 'Other Terms & Cond.',
    customValidator: (value, payload) => {
      const clinentSpecifiedCharges = payload?.otherTermsAndConditionsILC?.clientSpecifiedCharges?.value;
      const confirmationInstructions = payload?.generalILCDetails?.confirmationInstructions?.value;
      const reimbursementIntruction = payload?.generalILCDetails?.reimbursementInstruction?.value;
      return (clinentSpecifiedCharges === 'ACOA' &&
        (confirmationInstructions === 'WOUT' || confirmationInstructions === 'MADD')) ||
        clinentSpecifiedCharges === 'ACIC' ||
        reimbursementIntruction === 'NALD'
        ? null
        : !!value;
    },
  },
  {
    path: 'otherTermsAndConditionsILC?.issuanceCharges?.value',
    section: 'Other Terms & Cond.',
    customValidator: (value, payload) => {
      const clinentSpecifiedCharges = payload?.otherTermsAndConditionsILC?.clientSpecifiedCharges?.value;
      const confirmationInstructions = payload?.generalILCDetails?.confirmationInstructions?.value;
      return clinentSpecifiedCharges === 'ACOA' &&
        (confirmationInstructions === 'WOUT' || confirmationInstructions === 'MADD')
        ? null
        : !!value;
    },
  },
  {
    path: 'otherTermsAndConditionsILC?.interestTenorBorneByApplicant?.value',
    section: 'Other Terms & Cond.',
    customValidator: (value, payload) => {
      return payload?.otherTermsAndConditionsILC?.discountingInterest?.value === 'SPLT' ? !!value : null;
    },
  },
  {
    path: 'otherTermsAndConditionsILC?.interestTenorBorneByBeneficiary?.value',
    section: 'Other Terms & Cond.',
    customValidator: (value, payload) => {
      return payload?.otherTermsAndConditionsILC?.discountingInterest?.value === 'SPLT' ? !!value : null;
    },
  },

  {
    path: 'otherTermsAndConditionsILC?.additionalConditions?.value',
    section: 'Other Terms & Cond.',
    customValidator: (value, payload) => {
      const additionalConditions =
        payload?.otherTermsAndConditionsILC?.additionalConditions?.value ||
        payload?.otherTermsAndConditionsILC?.additionalConditions;

      return typeof additionalConditions !== 'object' && !validatePatternZ.test(additionalConditions)
        ? 'Additional Conditions not contain invalid character'
        : null;
    },
  },
  {
    path: 'otherTermsAndConditionsILC?.letterOfCreditCharges?.value',
    section: 'Other Terms & Cond.',
    customValidator: (value, payload) => {
      const letterOfCreditCharges =
        payload?.otherTermsAndConditionsILC?.letterOfCreditCharges?.value ||
        payload?.otherTermsAndConditionsILC?.letterOfCreditCharges;

      return typeof letterOfCreditCharges !== 'object' && !validatePatternZ.test(letterOfCreditCharges)
        ? 'Letter of Credit Charges not contain invalid character'
        : null;
    },
  },
  {
    path: 'otherTermsAndConditionsILC?.interestTenorBorneByApplicant?.value',
    section: 'Other Terms & Cond.',
    customValidator: (value, payload) => {
      const isValidate =
        !Number.isNaN(Number(payload?.otherTermsAndConditionsILC?.interestTenorBorneByApplicant?.value)) &&
        (Number(payload?.otherTermsAndConditionsILC?.interestTenorBorneByApplicant?.value) < 0 ||
          Number(payload?.otherTermsAndConditionsILC?.interestTenorBorneByApplicant?.value) > 999);

      return isValidate ? 'Interest Tenor Borne by Applicant (Days) value should be between 0 & 999' : null;
    },
  },
  {
    path: 'otherTermsAndConditionsILC?.interestTenorBorneByBeneficiary?.value',
    section: 'Other Terms & Cond.',
    customValidator: (value, payload) => {
      const isValidate =
        !Number.isNaN(Number(payload?.otherTermsAndConditionsILC?.interestTenorBorneByBeneficiary?.value)) &&
        (Number(payload?.otherTermsAndConditionsILC?.interestTenorBorneByBeneficiary?.value) < 0 ||
          Number(payload?.otherTermsAndConditionsILC?.interestTenorBorneByBeneficiary?.value) > 999);

      return isValidate ? 'Interest Tenor Borne by Beneficiary (Days) value should be between 0 & 999' : null;
    },
  },

  // *** Bank Instruction *** /
  {
    path: 'bankInstructionsILC?.specialPaymentConditionsForBeneficiary?.value',
    section: 'Bank Instructions',
    customValidator: (value, payload) => {
      const specialPaymentConditionsForBeneficiary =
        payload?.bankInstructionsILC?.specialPaymentConditionsForBeneficiary?.value ||
        payload?.bankInstructionsILC?.specialPaymentConditionsForBeneficiary;

      return typeof specialPaymentConditionsForBeneficiary !== 'object' &&
        !validatePatternZ.test(specialPaymentConditionsForBeneficiary)
        ? 'Special Payment Conditions for Beneficiary not contain invalid character'
        : null;
    },
  },
  {
    path: 'bankInstructionsILC?.overrideSpecialPaymentConditionsForBankOnly?.value',
    section: 'Bank Instructions',
    customValidator: (value, payload) => {
      const overrideSpecialPaymentConditionsForBankOnly =
        payload?.bankInstructionsILC?.overrideSpecialPaymentConditionsForBankOnly?.value ||
        payload?.bankInstructionsILC?.overrideSpecialPaymentConditionsForBankOnly;

      return typeof overrideSpecialPaymentConditionsForBankOnly !== 'object' &&
        !validatePatternZ.test(overrideSpecialPaymentConditionsForBankOnly)
        ? 'Override Special Payment Conditions not contain invalid character'
        : null;
    },
  },
  {
    path: 'bankInstructionsILC?.instructionsToThePayingAndAcceptingAndNegotiatingBank?.value',
    section: 'Bank Instructions',
    customValidator: (value, payload) => {
      const instructionsToThePayingAndAcceptingAndNegotiatingBank =
        payload?.bankInstructionsILC?.instructionsToThePayingAndAcceptingAndNegotiatingBank?.value ||
        payload?.bankInstructionsILC?.instructionsToThePayingAndAcceptingAndNegotiatingBank;

      return typeof instructionsToThePayingAndAcceptingAndNegotiatingBank !== 'object' &&
        !validatePatternX.test(instructionsToThePayingAndAcceptingAndNegotiatingBank)
        ? 'Instructions to the Paying/Accepting/Negotiating Bank not contain invalid character'
        : null;
    },
  },
  {
    path: 'bankInstructionsILC?.senderToReceiverInformation?.value',
    section: 'Bank Instructions',
    customValidator: (value, payload) => {
      const senderToReceiverInformation =
        payload?.bankInstructionsILC?.senderToReceiverInformation?.value ||
        payload?.bankInstructionsILC?.senderToReceiverInformation;

      return typeof senderToReceiverInformation !== 'object' && !validatePatternZ.test(senderToReceiverInformation)
        ? 'Sender to Receiver Information not contain invalid character'
        : null;
    },
  },

  // *** Shipment Data *** //
  
];
export const validateDocumentRequired = (documentsRequiredData: any) => {
  const errorMsg:any=[];
  const documentsRequired = documentsRequiredData?.overrideDocumentsRequired?.value || documentsRequiredData?.overrideDocumentsRequired;
  if(documentsRequiredData?.letterOfIndemnityAndWarrantyOfTitle?.value === "undefined" ||
    documentsRequiredData?.letterOfIndemnityAndWarrantyOfTitle?.value === ""
  ){
    errorMsg.push({ "section": "Documents Required.", "field": "letterOfIndemnityAndWarrantyOfTitle", "errorDescription": "letterOfIndemnityAndWarrantyOfTitle" });
  }
  if (typeof documentsRequired !== "object" && !validatePatternZ.test(documentsRequired)) {
    errorMsg.push({ "section": "Documents Required", "field": "Documents Required", "errorDescription": "Documents Required must not contain invalid character" });
  }
  return errorMsg;
}
