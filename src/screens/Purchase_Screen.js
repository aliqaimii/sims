import React, { Component } from 'react';
import { StyleSheet, View, Text, TextInput, Button, TouchableOpacity, FlatList, BackHandler, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CheckBox from '../components/CheckBox';
import { openDatabase } from 'react-native-sqlite-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import MyHeader from '../components/Header';
import { ScrollView } from 'react-native-gesture-handler';
import FontAwsome5 from 'react-native-vector-icons/dist/FontAwesome5';
import DatePicker from '../components/DatePicker';
import FontAwsome from 'react-native-vector-icons/dist/FontAwesome';
import { Snackbar } from 'react-native-paper'
import Overlay from '../components/Overlay';
import { colors } from '../theme';


export default class Purchase_Screen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            temp: [],
            tempPurchaseInvID: null,
            CompanyName: null,
            FlateListSearchItem: [],
            TempFlateListItem: [],
            selectedItem: [],
            SuppliersName: [],
            Items: [],
            itemCategory: [],

            SearchItemName: "",

            Quantity: "1",
            itemID: null,
            itemName: null,
            itemDescription: null,
            itemCode: null,
            itemBarCode: null,
            itemsTotolAmount: null,
            perUnitBuyingCost: null,
            perUnitSellingCost: null,
            itemCurrentstock: null,
            assOfDate: null,
            selloncash: true,


            selectedUnit: null,
            selectedSupplier: null,
            selectedSupplierName: null,
            selectedItemCategory: null,

            isAllItemSelected: false,

            isVisibleView1: true,
            isVisibleView0: false,
            isVisibleView4: false,
            isVisibleView3: false,
            isvisbleOverlay: false,

            ispickerVisible: true,
            istext1Visble: false,

            isVisiblesnakeBar: false,
            isVisibleItemDetails: false,
            isOkaybuttonVisible: false,



        }
        AsyncStorage.getItem('CurrentCompanyName', (err, result) => {
            if (result !== null) {
                var abc = result;
                this.setState({ CompanyName: abc });
            }

        });

        this.getPickerValues();

    }
    componentDidMount() {

        var monthNames = [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec',
        ];
        var that = this;
        var date = new Date().getDate(); //Current Date
        var month = monthNames[new Date().getMonth()]; //Current Month
        var year = new Date().getFullYear(); //Current Year


        that.setState({
            //Setting the value of the date time
            assOfDate:
                date + '-' + month + '-' + year,
        })
        this.backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
            Alert.alert("Cancel Invoice", "Are you sure to Cancel ",
                [{ text: "NO", onPress: () => { }, style: "cancel" },
                { text: "Yes", onPress: () => this.handelExit() }], { cancelable: true });
            return true;
        });
    }
    handelExit() {

        AsyncStorage.getItem('CurrentCompanyName', (err, result) => {
            if (result !== null) {
                var abc = result;
                this.setState({ ComapanyName: abc });
                var db_name = abc + ".db";
                db_name = db_name.replace(/\s/g, '');
                var db = openDatabase({ name: db_name });
                db.transaction(tx => {
                    tx.executeSql(
                        'DELETE FROM  PurchaseTempItems',
                        [],
                        (tx, results) => {
                            //             alert(results.rowsAffected
                            //  );
                            console.log('Results', results.rowsAffected);
                            if (results.rowsAffected > 0) {
                                this.setState({ istext1Visble: true })
                                this.setState({ isVisibleView0: false })
                            }

                        }
                    );


                });
            }
        });


        this.props.navigation.navigate('HOME_SCREEN')
    }
    componentWillUnmount() {
        this.backHandler.remove();
    }
    getPickerValues = () => {

        AsyncStorage.getItem('CurrentCompanyName', (err, result) => {


            if (result !== null) {
                var abc = result;
                this.setState({ CompanyName: abc });
                // alert(this.state.);

                var db_name = abc + ".db";
                db_name = db_name.replace(/\s/g, '');
                var db = openDatabase({ name: db_name });

                db.transaction(tx => {
                    tx.executeSql('SELECT * FROM Suppliers where IsActive =1', [], (tx, results) => {
                        var temp = [];
                        if (results.rows.length > 0) {
                            for (let i = 0; i < results.rows.length; ++i) {
                                temp.push(results.rows.item(i));
                            }
                            console.log(temp);
                            this.setState({
                                SuppliersName: temp,
                            });
                        }
                        else {
                            Alert.alert(
                                'No Supplier Found',
                                'Please Add A Supplier Which You Sale Items',
                                [
                                    {
                                        text: 'Ok',
                                        onPress: () =>
                                            this.props.navigation.navigate('ADD_SUPPLIER_SCREEN'),
                                    },
                                ],
                                { cancelable: false }
                            );
                        }
                    });
                });

                db.transaction(tx => {
                    tx.executeSql('SELECT * FROM InventoryItems where IsActive =1 ORDER BY ItemName', [], (tx, results) => {
                        var temp = [];
                        for (let i = 0; i < results.rows.length; ++i) {
                            temp.push(results.rows.item(i));
                        }
                        console.log(temp);
                        this.setState({
                            Item: temp,
                        });
                    });
                });

            }

        });
    }
    getInventoryItem = () => {


        AsyncStorage.getItem('CurrentCompanyName', (err, result) => {
            if (result !== null) {
                var abc = result;
                this.setState({ CompanyName: abc });
                // alert(this.state.);

                var db_name = abc + ".db";
                db_name = db_name.replace(/\s/g, '');
                var db = openDatabase({ name: db_name });

                db.transaction(tx => {
                    tx.executeSql('SELECT * FROM InventoryItems where IsActive =1 AND SupplierID = ? AND ItemID NOT IN(SELECT ItemID FROM PurchaseTempItems) ORDER BY ItemName', [this.state.selectedSupplier], (tx, results) => {
                        var temp = [];
                        for (let i = 0; i < results.rows.length; ++i) {
                            temp.push(results.rows.item(i));
                        }
                        console.log(temp);
                        this.setState({
                            Items: temp,
                        });
                        if (results.rows.length == 0) {


                            this.setState({ isAllItemSelected: true })
                            this.state.itemID = null;
                            this.state.itemName = null;
                            this.state.itemCurrentstock = null;
                            this.state.perUnitBuyingCost = null;
                            this.state.isVisibleItemDetails = false;
                            this.state.Quantity = "1";
                            this.setState({ isVisibleView1: true })
                            this.setState({ isVisibleView0: true })
                            this.setState({ isVisibleView4: false })
                            this.setState({ isVisibleView3: false })
                            this.setState({ istext1Visble: true })


                        }
                        else {
                            this.setState({ isAllItemSelected: false })


                        }
                    });
                });

            }

        });

    }
    getItem = () => {


        AsyncStorage.getItem('CurrentCompanyName', (err, result) => {
            if (result !== null) {
                var abc = result;
                this.setState({ CompanyName: abc });
                // alert(this.state.);

                var db_name = abc + ".db";
                db_name = db_name.replace(/\s/g, '');
                var db = openDatabase({ name: db_name });

                db.transaction(tx => {
                    tx.executeSql('SELECT * FROM InventoryItems where IsActive =1 AND SupplierID = ? ORDER BY ItemName ', [this.state.selectedSupplier], (tx, results) => {
                        var temp = [];
                        if (results.rows.length > 0) {
                            for (let i = 0; i < results.rows.length; ++i) {
                                temp.push(results.rows.item(i));
                            }
                            this.setState({ isVisibleView1: false })
                            this.setState({ isVisibleView4: true })
                            this.setState({ ispickerVisible: false })
                            this.setState({
                                Items: temp,
                            });

                        }
                        else {
                            alert(this.state.selectedSupplierName + " Does Not Have Any Item To sell Please Add A Item That Belong to " + this.state.selectedSupplierName)
                        }
                    });
                });

            }

        });

    }

    TempInvoiceValues = () => {

        AsyncStorage.getItem('CurrentCompanyName', (err, result) => {
            if (result !== null) {
                var abc = result;
                this.setState({ ComapanyName: abc });
                var db_name = abc + ".db";
                db_name = db_name.replace(/\s/g, '');
                var db = openDatabase({ name: db_name });
                db.transaction(tx => {
                    tx.executeSql('SELECT * FROM PurchaseTempItems ',
                        [], (tx, results) => {
                            var temp = [];
                            for (let i = 0; i < results.rows.length; ++i) {
                                temp.push(results.rows.item(i));
                            }
                            this.setState({
                                TempFlateListItem: temp,
                            });

                        });
                });
            }
        });

    }
    SuppliersList = () => {
        return (this.state.SuppliersName.map((x, i) => {
            return (<Picker.Item label={x.SupplierName} key={i} value={x.SupplierID} />)
        }));
    }
    onText1Press = () => {

        this.getInventoryItem();
        this.setState({ isVisibleView0: false })
        this.setState({ isVisibleView1: false })
        this.setState({ isVisibleView3: true })
        this.setState({ isVisibleView4: true })
        this.setState({ istext1Visble: false })


    }
    onAdd = () => {
        if (this.state.itemID === null) {
            alert("please select item from above for Purchase")
        }
        else {
            this.setState({ isVisibleView3: true })
            this.setState({ isOkaybuttonVisible: true })
            this.state.isVisibleItemDetails = false;
            AsyncStorage.getItem('CurrentCompanyName', (err, result) => {
                if (result !== null) {
                    var abc = result;
                    this.setState({ ComapanyName: abc });
                    var db_name = abc + ".db";
                    db_name = db_name.replace(/\s/g, '');
                    var db = openDatabase({ name: db_name });
                    db.transaction(tx => {
                        tx.executeSql(
                            'Select * from PurchaseTempItems where ItemID = ?',
                            [this.state.itemID],
                            (tx, results) => {
                                if (results.rows.length > 0) {

                                    var temp = results.rows.item(0);
                                    { this.state.itemsTotolAmount = this.state.itemsTotolAmount - (temp.ItemQuantity * temp.PerUnitCostprice) }

                                    tx.executeSql(
                                        'UPDATE PurchaseTempItems set  ItemName =?, ItemQuantity =?, PerUnitCostprice =?, CurrentStock =? where ItemID =?',
                                        [this.state.itemName, this.state.Quantity, this.state.perUnitBuyingCost, this.state.itemCurrentstock, this.state.itemID],
                                        (tx, results) => {
                                            if (results.rowsAffected > 0) {
                                                this.state.itemsTotolAmount = this.state.itemsTotolAmount + (this.state.perUnitBuyingCost * this.state.Quantity)
                                                this.state.FlateListSearchItem = null;
                                                this.state.itemID = null;
                                                this.state.itemName = null;
                                                this.state.itemCurrentstock = null;
                                                this.state.perUnitBuyingCost = null;
                                                this.state.Quantity = "1";
                                                this.TempInvoiceValues();
                                                this.getInventoryItem();

                                            }
                                        });


                                }
                                else {

                                    tx.executeSql(
                                        'INSERT INTO PurchaseTempItems( ItemID, ItemName, ItemQuantity, PerUnitCostprice, CurrentStock) VALUES (?,?,?,?,?)',
                                        [this.state.itemID, this.state.itemName, this.state.Quantity, this.state.perUnitBuyingCost, this.state.itemCurrentstock],
                                        (tx, results) => {
                                            if (results.rowsAffected > 0) {
                                                this.state.itemsTotolAmount = this.state.itemsTotolAmount + (this.state.perUnitBuyingCost * this.state.Quantity)
                                                this.state.FlateListSearchItem = null;
                                                this.state.itemID = null;
                                                this.state.itemName = null;
                                                this.state.itemCurrentstock = null;
                                                this.state.perUnitBuyingCost = null;
                                                this.state.Quantity = "1";
                                                this.setState({ isVisiblesnakeBar: true })
                                                this.getInventoryItem();
                                                this.TempInvoiceValues();

                                            }
                                        });

                                }
                            });
                    });
                }
            });


        }


    }
    onOkay = () => {
        this.state.itemID = null;
        this.state.itemName = null;
        this.state.itemCurrentstock = null;
        this.state.perUnitBuyingCost = null;
        this.state.isVisibleItemDetails = false;
        this.state.Quantity = "1";
        this.setState({ isVisibleView1: true })
        this.setState({ isVisibleView0: true })
        this.setState({ isVisibleView4: false })
        this.setState({ isVisibleView3: false })
        this.setState({ istext1Visble: true })
    }
    onSave = () => {



        ////////////////////main invoice table///////////////////
        // alert("Selected Supplier  :"+this.state.selectedSupplier+"   Date:"+this.state.assOfDate+"    totalAmount:"+this.state.itemsTotolAmount+"   Oncash:"+tempselloncash)
        // alert(this.state.selectedSupplierName)
        AsyncStorage.getItem('CurrentCompanyName', (err, result) => {
            if (result !== null) {
                var abc = result;
                this.setState({ ComapanyName: abc });
                var db_name = abc + ".db";
                db_name = db_name.replace(/\s/g, '');
                var db = openDatabase({ name: db_name });
                db.transaction(tx => {
                    var tempselloncash;
                    if (this.state.selloncash) {
                        tempselloncash = 1;
                    }
                    else {
                        tempselloncash = 0;
                    }
                    tx.executeSql(
                        'Select * from PurchaseTempItems',
                        [],
                        (tx, results) => {
                            if (results.rows.length > 0) {



                                tx.executeSql(
                                    'INSERT INTO Purchase( SupplierID, SupplierName, Date, TotalAmmount, OnCash) VALUES (?,?,?,?,?)',
                                    [this.state.selectedSupplier, this.state.selectedSupplierName, this.state.assOfDate, this.state.itemsTotolAmount, tempselloncash],
                                    (tx, results) => {
                                        console.log('Results', results.rowsAffected);
                                        if (results.rowsAffected > 0) {

                                            this.insertDataInvoceDetail();
                                        }
                                        else {
                                            alert('Registration Failed');
                                        }
                                    }
                                );
                            }
                            else {
                                alert("Please Select Atleast One Item to Purchase")
                            }

                        });


                });


            }
        });

        ///////////////////////////////////////main invoice table finish//////////////////
    }
    insertDataInvoceDetail = () => {

        AsyncStorage.getItem('CurrentCompanyName', (err, result) => {
            if (result !== null) {
                var abc = result;
                this.setState({ ComapanyName: abc });
                var db_name = abc + ".db";
                db_name = db_name.replace(/\s/g, '');
                var db = openDatabase({ name: db_name });
                db.transaction(tx => {
                    tx.executeSql(
                        'Select MAX(PurchaseID) as MAXID FROM Purchase',
                        [],
                        (tx, results) => {
                            var tempPurhaseid = results.rows.item(0)
                            if (results.rows.length > 0) {
                                this.setState({
                                    tempPurchaseInvID: tempPurhaseid.MAXID,
                                })
                            }
                        }
                    );
                });

                db.transaction(tx => {
                    tx.executeSql('SELECT * FROM PurchaseTempItems ',
                        [], (tx, results) => {
                            for (let i = 0; i < results.rows.length; ++i) {
                                var temp = [];
                                temp = results.rows.item(i);

                                // console.log(temp.ItemName);
                                //////////////////insert into invoice details///////////////////


                                tx.executeSql(
                                    'INSERT INTO PurchaseDetails( ItemID, ItemName,  PurchaseID, ItemQuantity, PerUnitCostprice,Date) VALUES (?,?,?,?,?,?)',
                                    [temp.ItemID, temp.ItemName, this.state.tempPurchaseInvID, temp.ItemQuantity, temp.PerUnitCostprice, this.state.assOfDate],
                                    (tx, results) => {
                                        console.log('Results', results.rowsAffected);
                                        if (results.rowsAffected > 0) {

                                            console.log("inserted");

                                        }
                                        else {
                                            alert('Registration Failed');
                                        }
                                    }
                                );
                            }
                            this.updateInventory();
                        });
                });
            }
        });
    }
    updateInventory = () => {
        AsyncStorage.getItem('CurrentCompanyName', (err, result) => {
            if (result !== null) {
                var abc = result;
                this.setState({ ComapanyName: abc });
                var db_name = abc + ".db";
                db_name = db_name.replace(/\s/g, '');
                var db = openDatabase({ name: db_name });

                db.transaction(tx => {
                    tx.executeSql('SELECT * FROM PurchaseTempItems ',
                        [], (tx, results) => {
                            for (let i = 0; i < results.rows.length; ++i) {
                                var temp = [];
                                temp = results.rows.item(i);
                                var tempupdatedstock = temp.CurrentStock + temp.ItemQuantity;
                                // console.log("Item quantity  "+temp.ItemQuantity +"  and  current stock"+temp.CurrentStock);
                                // console.log("item ids"+temp.ItemID)
                                // console.log(tempupdatedstock);


                                tx.executeSql(
                                    'UPDATE  InventoryItems set  CurrentStock =?,  AsOFDate=? where ItemID=?',
                                    [tempupdatedstock, this.state.assOfDate, temp.ItemID],
                                    (tx, results) => {
                                        if (results.rowsAffected > 0) {
                                            console.log("UPDATED")
                                        }
                                    }
                                );
                            }


                        });
                });
            }
        });



        AsyncStorage.getItem('CurrentCompanyName', (err, result) => {
            if (result !== null) {
                var abc = result;
                this.setState({ ComapanyName: abc });
                var db_name = abc + ".db";
                db_name = db_name.replace(/\s/g, '');
                var db = openDatabase({ name: db_name });
                db.transaction(tx => {
                    tx.executeSql(
                        'DELETE FROM PurchaseTempItems',
                        [],
                        (tx, results) => {


                        }
                    );


                });


            }
        });


        Alert.alert("Success", "Purchased Compeleted ",
            [
                { text: "Ok", onPress: () => this.handelExit() }], { cancelable: false });


    }
    selectFun = (item) => {

        this.state.itemID = item.ItemID;
        this.state.itemName = item.ItemName;
        this.state.itemCurrentstock = item.CurrentStock;
        this.state.perUnitBuyingCost = item.PerUnitCostPrice;
        const filteredData = this.state.Items;
        this.state.isVisibleItemDetails = true;
        this.setState({ Items: filteredData });
    }
    updateFun = (item) => {

        this.state.itemID = item.ItemID;
        this.state.itemName = item.ItemName;
        this.state.itemCurrentstock = item.CurrentStock;
        this.state.perUnitBuyingCost = item.PerUnitCostprice;
        this.state.Quantity = item.ItemQuantity;
        this.setState({ isvisbleOverlay: true });
    }
    onUpdate = () => {
        if (this.state.itemID === null) {
            alert("please select item from above for Purchase")
        }
        else {
            AsyncStorage.getItem('CurrentCompanyName', (err, result) => {
                if (result !== null) {
                    var abc = result;
                    this.setState({ ComapanyName: abc });
                    var db_name = abc + ".db";
                    db_name = db_name.replace(/\s/g, '');
                    var db = openDatabase({ name: db_name });
                    db.transaction(tx => {
                        tx.executeSql(
                            'Select * from PurchaseTempItems where ItemID = ?',
                            [this.state.itemID],
                            (tx, results) => {
                                if (results.rows.length > 0) {
                                    var temp = results.rows.item(0);
                                    {
                                        this.state.itemsTotolAmount = this.state.itemsTotolAmount - (temp.ItemQuantity * temp.PerUnitCostprice)
                                    }
                                    tx.executeSql(
                                        'UPDATE PurchaseTempItems set  ItemName =?, ItemQuantity =?, PerUnitCostprice =?, CurrentStock =? where ItemID =?',
                                        [this.state.itemName, this.state.Quantity, this.state.perUnitBuyingCost, this.state.itemCurrentstock, this.state.itemID],
                                        (tx, results) => {
                                            if (results.rowsAffected > 0) {
                                                this.state.itemsTotolAmount = this.state.itemsTotolAmount + (this.state.perUnitBuyingCost * this.state.Quantity)


                                                this.state.itemID = null;
                                                this.state.itemName = null;
                                                this.state.itemCurrentstock = null;
                                                this.state.perUnitBuyingCost = null;
                                                this.state.Quantity = "1";

                                                this.setState({ isvisbleOverlay: false });

                                                this.TempInvoiceValues();

                                            }
                                        });


                                }
                                else {
                                    alert("Can't Updated")
                                }
                            });
                    });
                }
            });


        }


    }
    onCancel = () => {
        this.setState({ isVisibleView0: true })
        this.setState({ isVisibleView1: true })
        this.setState({ istext1Visble: true })
        this.setState({ isvisbleOverlay: false })
        this.state.itemID = null;
        this.state.itemName = null;
        this.state.itemCurrentstock = null;
        this.state.perUnitBuyingCost = null;
        this.state.Quantity = "1";

    }
    ondelet = (item) => {
        var temp = item.ItemID;
        var tempqun = item.ItemQuantity;
        var temprice = item.PerUnitCostprice;
        { this.state.itemsTotolAmount = this.state.itemsTotolAmount - (tempqun * temprice) }
        AsyncStorage.getItem('CurrentCompanyName', (err, result) => {
            if (result !== null) {
                var abc = result;
                this.setState({ ComapanyName: abc });
                var db_name = abc + ".db";
                db_name = db_name.replace(/\s/g, '');
                var db = openDatabase({ name: db_name });
                db.transaction(tx => {
                    tx.executeSql(
                        'DELETE FROM  PurchaseTempItems  where ItemID=?',
                        [temp],
                        (tx, results) => {
                            //             alert(results.rowsAffected
                            //  );
                            console.log('Results', results.rowsAffected);
                            if (results.rowsAffected > 0) {
                                this.setState({ isAllItemSelected: false })
                                this.TempInvoiceValues();
                                this.getInventoryItem();

                            }

                        }
                    );


                });
            }
        });

    }
    getSupplierNameFun = () => {



        AsyncStorage.getItem('CurrentCompanyName', (err, result) => {
            if (result !== null) {
                var abc = result;
                this.setState({ CompanyName: abc });
                // alert(this.state.);

                var db_name = abc + ".db";
                db_name = db_name.replace(/\s/g, '');
                var db = openDatabase({ name: db_name });

                db.transaction(tx => {
                    tx.executeSql('SELECT * FROM Suppliers where IsActive =1 And SupplierID = ?',
                        [this.state.selectedSupplier], (tx, results) => {
                            var temp = [];
                            temp = results.rows.item(0);
                            this.setState({
                                selectedSupplierName: temp.SupplierName,
                            });
                        });
                });

            }

        });





    }

    render() {
        return (
            <ScrollView style={styles.container}>
                <MyHeader
                    title={"PURCAHSE"}
                    backGroundColor={colors.primary}

                />

                {this.state.isVisibleView0 ?
                    <View style={styles.view1}>
                        <View style={{ width: '100%', backgroundColor: colors.primary, flexDirection: "row", justifyContent: "center" }}>
                            <Text style={{ fontSize: 20, color: colors.textOnDark, textAlignVertical: "center" }}>SELECT ITEMS</Text>
                        </View>
                        <View style={{ width: '100%', backgroundColor: colors.primaryLight, flexDirection: "row" }}>
                            <Text style={{ fontSize: 20, color: colors.onPrimary, marginLeft: '5%', textAlignVertical: "center" }}>NAME</Text>
                            <Text style={{ fontSize: 20, color: colors.onPrimary, marginLeft: '10%', textAlignVertical: "center" }}>QUNTITY</Text>
                            <Text style={{ fontSize: 20, color: colors.onPrimary, marginLeft: '10%', textAlignVertical: "center" }}>TOL COST</Text>
                        </View>
                        <FlatList style={styles.flatelistStyle}
                            data={this.state.TempFlateListItem}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item }) => (
                                <View key={item.ItemID} style={styles.flatelistViewStyle}>
                                    <TouchableOpacity style={styles.buttonStyle1} onPress={() => { this.updateFun(item) }}   >
                                        <View style={{ flexDirection: "row" }}>
                                            <View style={{ width: '30%', justifyContent: "center", backgroundColor: colors.primaryLight }}>
                                                <Text style={{ fontSize: 20, color: colors.textOnDark, marginLeft: '15%' }}>{item.ItemName}</Text>
                                            </View>
                                            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: colors.primaryLight, width: '50%' }}>
                                                <Text style={{ fontSize: 18, color: colors.textOnDark, marginLeft: '10%', }}>{item.ItemQuantity}   </Text>
                                                <Text style={{ fontSize: 18, color: colors.textOnDark, marginLeft: '10%', }}>{item.PerUnitCostprice * item.ItemQuantity}</Text>
                                            </View>
                                            <TouchableOpacity style={{ marginLeft: '5%', justifyContent: "center" }} onPress={() => {
                                                Alert.alert("Delete Item", "Are you sure to Delete " + item.ItemName,
                                                    [{ text: "NO", onPress: () => { }, style: "cancel" },
                                                    { text: "Yes", onPress: () => this.ondelet(item) }], { cancelable: true });
                                            }}  >
                                                <MaterialCommunityIcons name="delete" size={28} color={colors.accent} />
                                            </TouchableOpacity>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            )}
                        />
                    </View> : null}
                {this.state.istext1Visble ? this.state.isAllItemSelected ?
                    null :
                    <TouchableOpacity onPress={() => { this.onText1Press() }}>
                        <Text style={{ fontSize: 16, color: 'gray', margin: 12, }}> + ADD MORE ITEMS </Text>
                    </TouchableOpacity>
                    : null}

                {this.state.isVisibleView1 ?
                    <View style={styles.view1}>
                        <Text style={{ marginTop: 8, marginLeft: 20, fontSize: 20, color: colors.textSecondary }}>DEATAILS</Text>
                        <DatePicker
                            style={{ marginLeft: 20, width: '90%', marginBottom: 12, marginTop: 12, alignItems: "center" }}
                            date={this.state.assOfDate}
                            mode="date"
                            placeholder="select date"
                            format="DD-MMM-YYYY"
                            minDate="2000-05-01"
                            maxDate="2050-12-30"
                            confirmBtnText="Confirm"
                            cancelBtnText="Cancel"
                            customStyles={{
                                dateIcon: {
                                    position: 'absolute',
                                    left: 0,
                                    top: 4,
                                    marginLeft: 0
                                },
                                dateInput: {
                                    marginLeft: 36
                                }
                                // ... You can check the source to find the other keys.
                            }}
                            onDateChange={(date) => { this.setState({ assOfDate: date }) }}
                        />
                        <View>
                            <View>


                                {this.state.ispickerVisible ? <Picker
                                    selectedValue={this.state.selectedSupplier}
                                    style={[styles.pickerStyle]}
                                    onValueChange={(value) => {

                                        this.setState({ selectedSupplier: value })
                                        this.getSupplierNameFun();
                                        this.getItem();



                                    }}
                                >
                                    <Picker.Item label='SELECT A SUPPLIER...' value='0' />
                                    {this.SuppliersList()}
                                </Picker>
                                    :
                                    <View>
                                        <View style={{ flexDirection: "row", justifyContent: "space-evenly", alignItems: "baseline" }}>

                                            <Text style={[styles.textstyle, { color: colors.primary, fontSize: 20 }]} >SUB TOTAL : {this.state.itemsTotolAmount} Rs</Text>

                                            <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "baseline" }}>
                                                <CheckBox
                                                    value={this.state.selloncash}
                                                    onValueChange={() => this.setState({ selloncash: !this.state.selloncash })}
                                                />
                                                {this.state.selloncash ?
                                                    <Text style={[styles.textstyle], { color: colors.success, fontSize: 20 }}
                                                        onPress={() => this.setState({ selloncash: !this.state.selloncash })}
                                                    >ON CASH</Text>
                                                    :
                                                    <Text style={[styles.textstyle], { color: colors.danger, fontSize: 20 }}
                                                        onPress={() => this.setState({ selloncash: !this.state.selloncash })}
                                                    >ON LOAN</Text>

                                                }
                                            </View>
                                        </View>

                                        <View>
                                            <Text style={[styles.textstyle], { alignSelf: "center", color: colors.primary, fontSize: 20, margin: 20 }}> SUPPLIER : {this.state.selectedSupplierName}</Text>

                                            <  TouchableOpacity style={styles.buttonStyle} onPress={this.onSave}>
                                                <View >
                                                    <Text style={styles.buttonTextStyle}>Save</Text>
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                }


                            </View>



                        </View>


                    </View> : null
                }


                {this.state.isVisibleView3 ?
                    <View style={styles.view1}>
                        <View style={{ width: '100%', backgroundColor: colors.primary, flexDirection: "row", justifyContent: "center" }}>
                            <Text style={{ fontSize: 20, color: colors.onPrimary, textAlignVertical: "center" }}>SELECT ITEMS</Text>
                        </View>
                        <View style={{ width: '100%', backgroundColor: colors.primaryLight, flexDirection: "row" }}>
                            <Text style={{ fontSize: 20, color: colors.onPrimary, marginLeft: '5%', textAlignVertical: "center" }}>NAME</Text>
                            <Text style={{ fontSize: 20, color: colors.onPrimary, marginLeft: '10%', textAlignVertical: "center" }}>QUNTITY</Text>
                            <Text style={{ fontSize: 20, color: colors.onPrimary, marginLeft: '10%', textAlignVertical: "center" }}>TOL COST</Text>
                        </View>


                        <FlatList style={styles.flatelistStyle}
                            data={this.state.TempFlateListItem}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item }) => (
                                <View key={item.ItemID} style={styles.flatelistViewStyle}>
                                    <TouchableOpacity style={styles.buttonStyle1}  >
                                        <View style={{ flexDirection: "row" }}>
                                            <View style={{ width: '30%', justifyContent: "center", backgroundColor: colors.primaryLight }}>
                                                <Text style={{ fontSize: 20, color: colors.textOnDark, marginLeft: '15%' }}>{item.ItemName}</Text>
                                            </View>
                                            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: colors.primaryLight, width: '50%' }}>
                                                <Text style={{ fontSize: 18, color: colors.textOnDark, marginLeft: '10%', }}>{item.ItemQuantity}   </Text>
                                                <Text style={{ fontSize: 18, color: colors.textOnDark, marginLeft: '10%', }}>{item.PerUnitCostprice * item.ItemQuantity}</Text>
                                            </View>
                                            <TouchableOpacity style={{ marginLeft: '5%', justifyContent: "center" }} onPress={() => {
                                                Alert.alert("Delete Item", "Are you sure to Delete " + item.ItemName,
                                                    [{ text: "NO", onPress: () => { }, style: "cancel" },
                                                    { text: "Yes", onPress: () => this.ondelet(item) }], { cancelable: true });
                                            }}  >
                                                <MaterialCommunityIcons name="delete" size={28} color={colors.accent} />
                                            </TouchableOpacity>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            )}
                        />
                    </View> : null}


                {this.state.isVisibleView4 ?
                    <View style={styles.view3}>

                        <View style={{ width: '100%', backgroundColor: colors.primary, flexDirection: "row", justifyContent: "center" }}>
                            <Text style={{ fontSize: 20, color: colors.onPrimary, textAlignVertical: "center" }}>AVAILABLE ITEMS</Text>
                        </View>
                        <View style={{ width: '100%', backgroundColor: colors.primaryLight, flexDirection: "row", justifyContent: "space-around" }}>
                            <Text style={{ fontSize: 20, color: colors.onPrimary, marginLeft: '5%', width: '30%' }}>NAME</Text>
                            <Text style={{ fontSize: 20, color: colors.onPrimary, marginLeft: '5%', width: '30%' }}>STOCK</Text>
                            <Text style={{ fontSize: 20, color: colors.onPrimary, marginLeft: '5%', width: '30%' }}>COST</Text>
                        </View>




                        <FlatList style={styles.flatelistStyle1}
                            data={this.state.Items}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item }) => (
                                <View key={item.ItemID} style={styles.flatelistViewStyle}>
                                    <TouchableOpacity style={styles.buttonStyle1} onPress={() => { this.selectFun(item) }} >
                                        <View style={{ flexDirection: "row", backgroundColor: colors.primaryLight, justifyContent: "space-around" }}>
                                            <Text style={{ fontSize: 20, color: colors.textOnDark, marginLeft: '5%', width: '30%' }}>{item.ItemName}</Text>
                                            <Text style={{ fontSize: 20, color: colors.textOnDark, marginLeft: '5%', width: '30%' }}>{item.CurrentStock}   </Text>
                                            <Text style={{ fontSize: 20, color: colors.textOnDark, marginLeft: '5%', width: '30%' }}>{item.PerUnitCostPrice}</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            )}
                        />



                        {this.state.isVisibleItemDetails ?
                            <View style={{ width: '100%', backgroundColor: colors.primary, flexDirection: "row", justifyContent: "center", borderWidth: 1, borderBottomWidth: 0, borderColor: colors.onPrimary }}>
                                <Text style={{ fontSize: 20, color: colors.textOnDark, textAlignVertical: "center" }}>ITEM DEATILS</Text>
                            </View> : null}
                        {this.state.isVisibleItemDetails ?

                            <TouchableOpacity style={{ width: '100%', backgroundColor: colors.primary, flexDirection: "row", justifyContent: "space-around", borderWidth: 1, borderColor: colors.onPrimary }}   >
                                <Text style={{ fontSize: 24, color: colors.textOnDark, marginLeft: '5%', width: '30%', textAlignVertical: "center", borderRightWidth: 1, borderColor: colors.onPrimary }}>{this.state.itemName}</Text>
                                <Text style={{ fontSize: 24, color: colors.textOnDark, marginLeft: '2%', width: '30%', borderRightWidth: 1, borderColor: colors.onPrimary }}>STOCK  {this.state.itemCurrentstock}</Text>
                                <Text style={{ fontSize: 24, color: colors.textOnDark, marginLeft: '2%', width: '30%' }}>COST      {this.state.perUnitBuyingCost}</Text>

                            </TouchableOpacity> : null}



                        <View style={{ flexDirection: "row", justifyContent: "space-evenly", marginTop: 20, alignItems: "center" }}>
                            <Text style={{ fontSize: 20, color: colors.primary, marginLeft: '5%', width: '30%', textAlignVertical: "center" }}>
                                Quantity   </Text>
                            <TextInput style={{ borderWidth: 1, fontSize: 20, color: colors.primary, width: '30%', textAlignVertical: "center" }}
                                value={this.state.Quantity}
                                keyboardType="number-pad"
                                onChangeText={(text) => { this.setState({ Quantity: text }) }}
                            />
                        </View>

                        <Text style={{ textAlign: "center", fontSize: 20, color: colors.primary, textAlignVertical: "center" }}>
                            Total Amount = {this.state.Quantity * this.state.perUnitBuyingCost} Rs
                    </Text>

                        <View style={{ flexDirection: "row", justifyContent: "space-around", marginTop: 12 }}>

                            {this.state.isOkaybuttonVisible ? <TouchableOpacity style={styles.buttonStyle} onPress={this.onOkay}>
                                <View >
                                    <Text style={styles.buttonTextStyle}>Okay</Text>
                                </View>
                            </TouchableOpacity> : null}
                            <TouchableOpacity style={styles.buttonStyle} onPress={this.onAdd}>
                                <View >
                                    <Text style={styles.buttonTextStyle}>Add</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View> : null}




                <Overlay isVisible={this.state.isvisbleOverlay}
                    onBackdropPress={() => this.setState({ isvisbleOverlay: false })}
                    windowBackgroundColor="rgba(255, 255, 255, .7)"
                    // windowBackgroundColor={colors.primaryLight}

                    overlayBackgroundColor="white"
                    width="auto"
                    height="auto"
                >
                    <View>
                        <TouchableOpacity style={[styles.buttonStyle1, { marginTop: 20 }]}   >
                            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", margin: 20 }}>
                                <View style={{ width: "50%" }}>
                                    <Text style={{ fontSize: 28, color: colors.onPrimary, marginLeft: '10%' }}> {this.state.itemName}</Text>
                                </View>

                                <View style={{ width: "50%" }}>
                                    <Text style={{ fontSize: 20, color: colors.textOnDark, marginLeft: '10%' }}>Stock       {this.state.itemCurrentstock}</Text>
                                    <Text style={{ fontSize: 20, color: colors.textOnDark, marginLeft: '10%' }}>Cost        {this.state.perUnitBuyingCost}</Text>
                                    <Text style={{ fontSize: 20, color: colors.textOnDark, marginLeft: '10%' }}>Quantity    {this.state.Quantity}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>

                        <View style={{ flexDirection: "row", justifyContent: "space-evenly", marginTop: 20, alignItems: "center" }}>
                            <Text style={{ fontSize: 20, color: colors.primary, width: '50%', textAlignVertical: "center" }}>
                                New Quantity </Text>
                            <TextInput style={{ borderWidth: 1, width: 90, fontSize: 20, color: colors.primary, textAlignVertical: "center" }}
                                value={this.state.Quantity}
                                keyboardType="number-pad"
                                onChangeText={(text) => { this.setState({ Quantity: text }) }}
                            />
                        </View>
                        <Text style={{ textAlign: "center", fontSize: 20, color: colors.primary, textAlignVertical: "center", marginTop: 12 }}>
                            Total Amount = {this.state.Quantity * this.state.perUnitBuyingCost} Rs
                  </Text>

                        <View style={{ flexDirection: "row", justifyContent: "space-around", marginTop: 12 }}>
                            <TouchableOpacity style={styles.buttonStyle} onPress={this.onCancel}>
                                <View >
                                    <Text style={styles.buttonTextStyle}>Cancel</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.buttonStyle} onPress={this.onUpdate}>
                                <View >
                                    <Text style={styles.buttonTextStyle}>Update</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Overlay>


                <Snackbar
                    style={{ width: '80%', alignSelf: "center", alignContent: "center", alignItems: "center" }}
                    duration={100}
                    visible={this.state.isVisiblesnakeBar}
                    onDismiss={() => this.setState({ isVisiblesnakeBar: false })}>
                    Item Added
                  </Snackbar>

            </ScrollView>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    textstyle: {
        marginLeft: 12, paddingTop: 12, fontSize: 16
    },
    textInputStyle: {
        borderBottomWidth: 1, width: ('95%'), marginLeft: 12, height: 40, marginBottom: 12,
        fontSize: 18
    },
    pickerStyle: {
        height: 50, width: ('95%'), marginLeft: 12, marginBottom: 0, color: colors.primary
    },
    view1: {
        borderWidth: 1,
        borderRadius: 8,
        borderColor: colors.border,
        borderBottomWidth: 0,
        shadowColor: colors.textPrimary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 1,
        marginLeft: 8,
        marginRight: 8,
        marginTop: 8,
    },
    view3: {
        borderWidth: 1,
        borderRadius: 8,
        borderColor: colors.border,
        borderBottomWidth: 0,
        shadowColor: colors.textPrimary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 1,
        marginBottom: 20,
        marginLeft: 8,
        marginRight: 8,
        marginTop: 8,
    },
    buttonStyle: {
        alignSelf: "center",
        alignContent: "center",
        backgroundColor: colors.primary,
        textAlign: 'center',
        margin: 8,
        width: 150,
        borderRadius: 8,
        shadowColor: colors.textPrimary,
        shadowOffset: {
            width: 2,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        marginBottom: 20,
        elevation: 2,
    },
    buttonStyle1: {
        alignSelf: "center",
        backgroundColor: colors.primary,
        textAlign: 'center',
        margin: 8,
        width: '98%',
        borderRadius: 8,
        shadowColor: colors.textPrimary,
        shadowOffset: {
            width: 2,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2,

        elevation: 2,
    },
    buttonTextStyle: {
        fontSize: 16,
        textAlign: 'center',
        color: colors.textOnDark,
        margin: 8,
    },
    SearchTextInput: {
        textAlign: 'center',
        alignSelf: "center",
        width: 300,
        marginTop: 12,
        borderWidth: 1,
        borderColor: colors.primary,
        borderRadius: 8,

    },
    flatelistStyle: {
        height: 200,
        marginTop: 12,
        marginBottom: 12,
        paddingBottom: 8,

    },
    flatelistStyle1: {
        height: 130,
        marginTop: 12,
        marginBottom: 12,
        paddingBottom: 8,


    },
    flatelistViewStyle: {
        backgroundColor: colors.primaryLight,
        marginBottom: 4,
    },
    //  icon:{
    //    marginRight: 20,
    //     justifyContent: 'flex-start',
    //     alignItems: 'flex-end',
    //  }

});
