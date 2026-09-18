import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import StartScreen from '../screens/StartScreen';
import Login_company_screen from '../screens/Login_company_screen';
import create_company_screen from '../screens/Create_Company_screen';
import view_company_detail_screen from '../screens/view_company_detail';
import Home_Screen from '../screens/Home_Screen';
import Customers_Screen from '../screens/Customers_Screen';
import Add_Customer_Screen from '../screens/Add_Customer_Screen';
import Suppliers_Screen from '../screens/Suppliers_Screen';
import Add_Supplier_Screen from '../screens/Add_Supplier_Screen';
import Inventory_Screen from '../screens/Inventory_Screen';
import Units_Screen from '../screens/Units_Screen';
import AddInventoryUnitScreen from '../screens/Add_Inventory_Unit_Screen';
import Items_Screen from '../screens/Items_Screen';
import Add_Inventory_Item_Screen from '../screens/Add_Invantory_Item_Screen';
import Edit_Inventory_Item_Screen from '../screens/Edit_Invantory_Item_Screen';
import Items_Category from '../screens/Items_Category';
import Add_Item_Category from '../screens/Add_Item_Category';
import All_Sell_Screen from '../screens/All_Sell_Screen';
import Sell_Deatail_Screen from '../screens/Sell_Deatail_Screen';
import Splash_Screen from '../screens/Splash_Screen';
import Purchase_Screen from '../screens/Purchase_Screen';
import All_Purchase_Screen from '../screens/All_Purchase_Screen';
import Purchase_Details_Screen from '../screens/Purchase_Details_Screen';
import Settings_Screen from '../screens/Settings_Screen';
import Sell_Screen from '../screens/Sell_Screen';

const Stack = createNativeStackNavigator();

/**
 * Compatibility shim for the react-navigation v3 API the screens were written
 * against. v5 dropped `navigation.getParam()` and `navigation.state` in favour
 * of a separate `route` prop; rather than rewrite 46 call sites across 20
 * screens, we re-attach those two members to the navigation object.
 */
const withLegacyNavigation = Screen =>
  function LegacyScreen(props) {
    const { navigation, route } = props;
    const legacyNavigation = React.useMemo(
      () => ({
        ...navigation,
        getParam: (name, fallback = null) => {
          const value = route && route.params ? route.params[name] : undefined;
          return value === undefined ? fallback : value;
        },
        state: {
          params: (route && route.params) || {},
          key: route && route.key,
          routeName: route && route.name,
        },
      }),
      [navigation, route],
    );

    return <Screen {...props} navigation={legacyNavigation} />;
  };

const screens = {
  SPLASH_SCREEN: Splash_Screen,
  STARTSCREEN: StartScreen,
  LOGINCOMPANY: Login_company_screen,
  CREATECOMPANY: create_company_screen,
  VIEW_COMPANY_DETAIL: view_company_detail_screen,
  HOME_SCREEN: Home_Screen,

  // customers
  CUSTOMERS_SCRREN: Customers_Screen,
  ADD_CUSTOMER_SCREEN: Add_Customer_Screen,

  // suppliers
  SUPPLIERS_SCRREN: Suppliers_Screen,
  ADD_SUPPLIER_SCREEN: Add_Supplier_Screen,

  // inventory
  INVENTORY: Inventory_Screen,

  // items
  ITEMS_SCREEN: Items_Screen,
  ADD_INVENTORY_ITEM_SCREEN: Add_Inventory_Item_Screen,
  EDIT_INVENTORY_ITEM_SCREEN: Edit_Inventory_Item_Screen,

  // item categories
  ITEMS_CATEGORY: Items_Category,
  ADD_ITEM_CATEGORY: Add_Item_Category,

  // item units
  UNITS_SCREEN: Units_Screen,
  ADD_INVENTORY_UNIT_SCREEN: AddInventoryUnitScreen,

  // selling
  SELL_SCREEN: Sell_Screen,
  ALL_SELL_SCREEN: All_Sell_Screen,
  SELL_DEATAIL_SCREEN: Sell_Deatail_Screen,

  // purchasing
  PURCHASE_SCREEN: Purchase_Screen,
  ALL_PURCHASE_SCREEN: All_Purchase_Screen,
  PURCHASE_DETAILS_SCREEN: Purchase_Details_Screen,

  SETTINGS_SCREEN: Settings_Screen,
};

// Wrap once at module scope: doing it inside render would create a new
// component type on every render and remount the active screen.
const routes = Object.entries(screens).map(([name, Screen]) => [
  name,
  withLegacyNavigation(Screen),
]);

export default function My_Switch_Navigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="SPLASH_SCREEN"
        // The screens draw their own headers and handle the hardware back
        // button themselves, which is what createSwitchNavigator used to give us.
        screenOptions={{ headerShown: false, animation: 'none' }}>
        {routes.map(([name, Screen]) => (
          <Stack.Screen key={name} name={name} component={Screen} />
        ))}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
