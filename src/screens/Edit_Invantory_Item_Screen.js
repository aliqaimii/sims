import React, { Component } from 'react';
import { StyleSheet, View, Text, TextInput, Button, TouchableOpacity, BackHandler, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { openDatabase } from 'react-native-sqlite-storage';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MyHeader from '../components/Header';
import { ScrollView } from 'react-native-gesture-handler';
import DatePicker from '../components/DatePicker';
import { colors } from '../theme';

export default class Edit_Inventory_Item_Screen extends React.Component {

    constructor(props) {
        super(props);

        this.state = {

            CompanyName: null,

            unitname: [],
            suppliersname: [],
            itemCategory: [],


            itemName: null,
            itemDescription: null,
            itemCode: null,
            itemBarCode: null,
            perUnitBuyingCost: null,
            perUnitSellingCost: null,
            itemCurrentstock: null,
            itemMinimumStock: null,
            assOfDate: null,


            selectedUnit: null,
            selectedSupplier: null,
            selectedItemCategory: null,
            previousUnit: null,
            previousSupplier: null,
            previousItemCategory: null,
            isVisibleView1: false,
            isVisibleView2: false,
        }

        const { navigation } = this.props;
        const IID = navigation.getParam('itemid', null);
        const IN = navigation.getParam('itemname', null);
        const IDISP = navigation.getParam('itemdisp', null);
        const ICODE = navigation.getParam('itemcode', null);
        const IBCODE = navigation.getParam('itembarcode', null);

        const UID = navigation.getParam('uid', null);
        const CID = navigation.getParam('cid', null);
        const SID = navigation.getParam('sid', null);

        const IPUCP = navigation.getParam('itempuc', null);
        const IPUSP = navigation.getParam('itempus', null);
        const IS = navigation.getParam('itemstock', null);
        const IMS = navigation.getParam('itemminstock', null);

        const ITEMASOFDATE = navigation.getParam('itemasofdate', null);






        this.state.itemID = IID;
        this.state.itemName = IN;
        this.state.itemDescription = IDISP;
        this.state.itemCode = ICODE;
        this.state.itemBarCode = IBCODE;

        this.state.selectedUnit = UID;
        this.state.selectedItemCategory = CID;
        this.state.selectedSupplier = SID;

        this.state.perUnitBuyingCost = IPUCP;
        this.state.perUnitSellingCost = IPUSP
        this.state.itemCurrentstock = IS;
        this.state.itemMinimumStock = IMS;

        this.state.assOfDate = ITEMASOFDATE;



        AsyncStorage.getItem('CurrentCompanyName', (err, result) => {
            if (result !== null) {
                var abc = result;
                this.setState({ CompanyName: abc });
            }

        });
        // this.getPickerValues();
        this.getItems();
    }
    ////////////////////////////////////////////////////////////////////////////////////

    componentDidMount() {
        this.backHandler =
            BackHandler.addEventListener("hardwareBackPress", () => this.props.navigation.navigate("ITEMS_SCREEN"))
    }

    componentWillUnmount() {
        this.backHandler.remove();
    }

    onText1Press = () => {
        if (this.state.isVisibleView1 == true) {
            this.setState({ isVisibleView1: false })
        }
        else {
            this.setState({ isVisibleView1: true })
        }
    }
    onText2Press = () => {
        if (this.state.isVisibleView2 == true) {
            this.setState({ isVisibleView2: false })
        }
        else {
            this.setState({ isVisibleView2: true })
        }


    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////// get valuse///////////////////////////////////////////////////////////////


    getItems = () => {


        AsyncStorage.getItem('CurrentCompanyName', (err, result) => {
            if (result !== null) {
                var abc = result;
                this.setState({ ComapanyName: abc });
                // alert(this.state.ComapanyName);
                var db_name = abc + ".db";
                db_name = db_name.replace(/\s/g, '');
                var db = openDatabase({ name: db_name });

                db.transaction(tx => {
                    tx.executeSql('SELECT * FROM InventoryItems where IsActive =1 AND ItemID=?', [this.state.itemID], (tx, results) => {
                        if (results.rows.length > 0) {
                            var temp = results.rows.item(0)

                            // this.setState({ itemMinimumStock: temp.MinimumStock })
                        }

                    });
                });

                ///////////////////////////////////////////////////////////////
                ////////////////////////////// Units //////////////////////////////////


                db.transaction(tx => {
                    tx.executeSql('SELECT * FROM UnitOfMeasure where IsActive =1 AND UnitID != ?', [this.state.selectedUnit], (tx, results) => {
                        var temp = [];
                        for (let i = 0; i < results.rows.length; ++i) {
                            temp.push(results.rows.item(i));
                        }
                        this.setState({
                            unitname: temp,
                        });
                    });
                });


                db.transaction(tx => {
                    tx.executeSql('SELECT * FROM UnitOfMeasure where IsActive =1 AND UnitID=?', [this.state.selectedUnit], (tx, results) => {
                        var len = results.rows.length;
                        console.log('len', len);
                        if (len > 0) {
                            this.setState({
                                previousUnit: results.rows.item(0),
                            });
                        }
                    });
                });


                ////////////////////////////////////////////////////////////////////////////////
                //////////////////////////// supplier /////////////////////////////////////////
                db.transaction(tx => {
                    tx.executeSql('SELECT * FROM Suppliers where IsActive =1 And SupplierID != ?', [this.state.selectedSupplier], (tx, results) => {
                        var temp = [];
                        for (let i = 0; i < results.rows.length; ++i) {
                            temp.push(results.rows.item(i));
                        }
                        this.setState({
                            suppliersname: temp,
                        });
                    });
                });
                db.transaction(tx => {
                    tx.executeSql('SELECT * FROM Suppliers where IsActive =1 And SupplierID=?', [this.state.selectedSupplier], (tx, results) => {
                        var len = results.rows.length;
                        console.log('len', len);
                        if (len > 0) {
                            this.setState({
                                previousSupplier: results.rows.item(0),
                            });
                        }
                    });
                });
                //////////////////////////////////////////////////////////////////////////////////////////////
                /////////////////////////////////////////Item Categoty///////////////////////////////////////

                db.transaction(tx => {
                    tx.executeSql('SELECT * FROM ItemCategory where IsActive =1 AND ItemCategoryID != ?', [this.state.selectedItemCategory], (tx, results) => {
                        var temp = [];
                        for (let i = 0; i < results.rows.length; ++i) {
                            temp.push(results.rows.item(i));
                        }
                        this.setState({
                            itemCategory: temp,
                        });
                    });
                });

                db.transaction(tx => {
                    tx.executeSql('SELECT * FROM ItemCategory where IsActive =1 AND ItemCategoryID=?', [this.state.selectedItemCategory], (tx, results) => {
                        var len = results.rows.length;
                        console.log('len', len);
                        if (len > 0) {
                            this.setState({
                                previousItemCategory: results.rows.item(0),
                            });
                        } else {
                            alert('No Item Category found');
                            this.setState({
                                selectedItemCategory: '',
                            });
                        }
                    });
                });


            }

        });

    }
    /////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////get picker values ////////////////////////////////////////////////////

    Unitlist = () => {
        return (this.state.unitname.map((x, i) => {
            return (<Picker.Item label={x.UnitName} key={i} value={x.UnitID} />)
        }));
    }

    Supplierslist = () => {

        return (this.state.suppliersname.map((x, i) => {
            return (<Picker.Item label={x.SupplierName} key={i} value={x.SupplierID} />)
        }));
    }

    ItemCategorylist = () => {
        return (this.state.itemCategory.map((x, i) => {
            return (<Picker.Item label={x.ItemCategoryName} key={i} value={x.ItemCategoryID} />)
        }));
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////// update unit function ///////////////////////////////////////////////////////

    UpdateItem = () => {

        var that = this;
        const { CompanyName } = this.state;

        const { itemID } = this.state;
        const { itemName } = this.state;
        const { itemDescription } = this.state;
        const { itemCode } = this.state;
        const { itemBarCode } = this.state;

        const { selectedUnit } = this.state;
        const { previousUnit } = this.state;
        const { selectedSupplier } = this.state;
        const { previousSupplier } = this.state;
        const { selectedItemCategory } = this.state;
        const { previousItemCategory } = this.state;

        const { perUnitBuyingCost } = this.state;
        const { perUnitSellingCost } = this.state;
        const { itemCurrentstock } = this.state;
        const { itemMinimumStock} = this.state;

        const { assOfDate } = this.state;

        // alert(selectedSupplier+"  "+selectedUnit+"  "+selectedItemCategory)
        // alert(itemName + "   " + itemDescription + "   " + itemCode + "  " + itemBarCode + "  " + selectedUnit.UnitID + "  " + db_name)
        // alert(selectedItemCategory.ItemCategoryID+"  "+selectedSupplier.SupplierID+"  "+selectedUnit.UnitID)
        // alert(perUnitBuyingCost+"  "+perUnitSellingCost+"  "+itemCurrentstock+"  "+assOfDate);

        /////////////////////////////////////////////////////////////////

        var db_name = CompanyName + ".db";
        db_name = db_name.replace(/\s/g, '');
        var db = openDatabase({ name: db_name });
        db.transaction(function (txn) {
            // txn.executeSql('CREATE TABLE IF NOT EXISTS InventoryItems(ItemID INTEGER PRIMARY KEY AUTOINCREMENT, ItemName VARCHAR(20) NOT NULL, ItemDescription VARCHAR(100), ItemCode VARCHAR(30), ItemBarcode VARCHAR(30), UnitID INTEGER, ItemCategoryID INTEGER, SupplierID INTEGER,  PerUnitCostPrice VARCHAR(10) NOT NULL, PerUnitSellprice VARCHAR(10) NOT NULL, CurrentStock INTEGER NOT NULL, AsOFDate VARCHAR(30), IsActive INTEGER DEFAULT 1 )', []);
            txn.executeSql('UPDATE InventoryItems set ItemName = ?, ItemDescription = ?, ItemCode = ?, ItemBarcode = ?, UnitID = ?, ItemCategoryID = ?, SupplierID = ?,  PerUnitCostPrice = ?, PerUnitSellprice = ?, CurrentStock = ?, MinimumStock = ?, AsOFDate  = ? where ItemID = ?',
                [itemName, itemDescription, itemCode, itemBarCode, selectedUnit, selectedItemCategory, selectedSupplier, perUnitBuyingCost, perUnitSellingCost, itemCurrentstock,itemMinimumStock, assOfDate, itemID],
                (txn, results) => {
                    console.log('Results  new ', results.rowsAffected);
                    if (results.rowsAffected > 0) {
                        Alert.alert(
                            'Success',
                            'Item Updated Successfully',
                            [
                                {
                                    text: 'Ok',
                                    onPress: () =>
                                        that.props.navigation.navigate('ITEMS_SCREEN'),
                                },
                            ],
                            { cancelable: false }
                        );
                    }
                    else {
                        alert('Registration Failed');
                    }
                }

            );



        });

        /////////////////////////////////////////////////////////////




    }

    DeleteItem = () => {

        var that = this;
        const { CompanyName } = this.state;
        const { itemID } = this.state;

        /////////////////////////////////////////////////////////////////
        var db_name = CompanyName + ".db";
        db_name = db_name.replace(/\s/g, '');
        var db = openDatabase({ name: db_name });
        db.transaction(function (txn) {
            txn.executeSql('UPDATE InventoryItems set IsActive= 0 where ItemID = ?',
                [itemID],
                (txn, results) => {
                    console.log('Results  new ', results.rowsAffected);
                    if (results.rowsAffected > 0) {
                        Alert.alert(
                            'Success',
                            'Item Delete Successfully',
                            [
                                {
                                    text: 'Ok',
                                    onPress: () =>
                                        that.props.navigation.navigate('ITEMS_SCREEN'),
                                },
                            ],
                            { cancelable: false }
                        );
                    }
                    else {
                        alert('Registration Failed');
                    }
                }

            );



        });

        /////////////////////////////////////////////////////////////



    }


    render() {
        return (

            <View style={styles.container}>

                <MyHeader

                    title={"EDIT ITEM"}
                    rightIcon={"update"}
                    backGroundColor={colors.primary}
                    go={this.UpdateItem}
                // go={() => this.props.navigation.navigate('INVENTORY')}
                />
                {/* // txn.executeSql('CREATE TABLE IF NOT EXISTS InventoryItems(ItemID INTEGER PRIMARY KEY AUTOINCREMENT, ItemName VARCHAR(20) NOT NULL, ItemDescription VARCHAR(100), ItemCode VARCHAR(30), Barcode VARCHAR(30), PerUnitCostPrice VARCHAR(10) NOT NULL, PerUnitSellprice VARCHAR(10) NOT NULL, CurrentStock INTEGER NOT NULL, AsOFDate VARCHAR(30), UnitID INTEGER,I temCategoryID INTEGER, ItemSubCategoryID INTEGER, SupplierID INTEGER, IsActive INTEGER DEFAULT 1 )', []); */}
                <ScrollView >
                    <View style={{ marginBottom: 50 }}>


                        {/* /////////////////////////////////////VIEW 1 BASCI DETAILS//////////////////////////////////// */}

                        <View style={styles.view1}>
                            <Text style={styles.textstyle}>Item Name</Text>
                            <TextInput style={styles.textInputStyle} placeholder="Item Name"
                                value={this.state.itemName}
                                returnKeyType="next" blurOnSubmit={false}
                                onSubmitEditing={() => this.ItemDisp.focus()}
                                onChangeText={(text) => { this.setState({ itemName: text }) }}
                            />

                            <Text style={styles.textstyle}>Item Description</Text>
                            <TextInput style={styles.textInputStyle} placeholder="Item Description"
                                ref={ref => this.ItemDisp = ref}
                                value={this.state.itemDescription}
                                returnKeyType="next" blurOnSubmit={false} onSubmitEditing={() => this.ItemCode.focus()}
                                onChangeText={(text) => { this.setState({ itemDescription: text }) }}
                            />
                            <Text style={styles.textstyle}>Item Code</Text>
                            <TextInput style={styles.textInputStyle} placeholder="Item Code"
                                ref={ref => this.ItemCode = ref}
                                value={this.state.itemCode}
                                returnKeyType="next" blurOnSubmit={false} onSubmitEditing={() => this.itembarcode.focus()}
                                onChangeText={(text) => { this.setState({ itemCode: text }) }}
                            />

                            <Text style={styles.textstyle}>Item Barcode</Text>
                            <TextInput style={styles.textInputStyle} placeholder="Item Barcode"
                                ref={ref => this.itembarcode = ref}
                                value={this.state.itemBarCode}
                                keyboardType="number-pad"
                                onChangeText={(text) => { this.setState({ itemBarCode: text }) }}
                            />
                        </View>


                        {/* /////////////////////////////////////VIEW 2 ITEM TYPE DETAIL//////////////////////////////////// */}



                        <TouchableOpacity onPress={() => { this.onText1Press() }}>
                            <Text style={{ fontSize: 14, color: 'gray', margin: 12, }}>ITEM PROPERTIES</Text>
                        </TouchableOpacity>

                        {this.state.isVisibleView1 ?
                            <View style={styles.view1}>

                                <Text style={styles.textstyle}>Select Supplier</Text>
                                <Picker
                                    selectedValue={this.state.selectedSupplier}
                                    style={styles.pickerStyle}
                                    onValueChange={(value) => (this.setState({ selectedSupplier: value }))}>
                                    <Picker.Item label={"Current Supplier  :  " + this.state.previousSupplier.SupplierName} value={this.state.previousSupplier.SupplierID} />
                                    {this.Supplierslist()}
                                </Picker>

                                <Text style={styles.textstyle}>Select Unit</Text>
                                <Picker
                                    selectedValue={this.state.selectedUnit}
                                    style={styles.pickerStyle}
                                    onValueChange={(value) => (this.setState({ selectedUnit: value }))}>
                                    <Picker.Item label={"Current Unit  :  " + this.state.previousUnit.UnitName} value={this.state.previousUnit.UnitID} />

                                    {this.Unitlist()}
                                </Picker>

                                <Text style={styles.textstyle}>Select Item Category</Text>
                                <Picker
                                    selectedValue={this.state.selectedItemCategory}
                                    style={styles.pickerStyle}
                                    onValueChange={(value) => (
                                        this.setState({ selectedItemCategory: value }))}>
                                    <Picker.Item label={"Current Category  :  " + this.state.previousItemCategory.ItemCategoryName} value={this.state.previousItemCategory.ItemCategoryID} />

                                    {this.ItemCategorylist()}
                                </Picker>
                            </View>
                            : null}

                        {/* /////////////////////////////////////VIEW 3 PRICE AND STOCK DETAIL//////////////////////////////////// */}


                        <TouchableOpacity onPress={() => { this.onText2Press() }}>
                            <Text style={{ fontSize: 14, color: 'gray', margin: 12, }}>PRICING DETAILS/STOCK</Text>
                        </TouchableOpacity>

                        {this.state.isVisibleView2 ?
                            <View style={styles.view1}>
                                <Text style={styles.textstyle}>Perunit Buying Cost </Text>
                                <TextInput style={styles.textInputStyle} placeholder="Perunit Buying Cost" keyboardType="number-pad"
                                    value={this.state.perUnitBuyingCost}
                                    returnKeyType="next" blurOnSubmit={false} onSubmitEditing={() => this.itemsellcost.focus()}
                                    onChangeText={(text) => { this.setState({ perUnitBuyingCost: text }) }}
                                />

                                <Text style={styles.textstyle}>Perunit Selling Cost </Text>
                                <TextInput style={styles.textInputStyle} placeholder="Perunit Selling Cost" keyboardType="number-pad"
                                    ref={ref => this.itemsellcost = ref}
                                    value={this.state.perUnitSellingCost}
                                    returnKeyType="next" blurOnSubmit={false} onSubmitEditing={() => this.itemstock.focus()}
                                    onChangeText={(text) => { this.setState({ perUnitSellingCost: text }) }}
                                />



                                <Text style={styles.textstyle}>Current Stock </Text>
                                <TextInput style={styles.textInputStyle} placeholder="Current Stock / Items you have"
                                    value={this.state.itemCurrentstock}
                                    keyboardType="number-pad" ref={ref => this.itemstock = ref}
                                    onChangeText={(text) => { this.setState({ itemCurrentstock: text }) }}
                                />

                                <Text style={styles.textstyle}>Minimum Stock </Text>
                                <TextInput style={styles.textInputStyle}
                                    value={this.state.itemMinimumStock}
                                    placeholder="Stock you should have"
                                    keyboardType="number-pad" ref={ref => this.itemMinstock = ref}
                                    onChangeText={(text) => { this.setState({ itemMinimumStock: text }) }}
                                />

                                <Text style={styles.textstyle}>As Of Date</Text>
                                <DatePicker
                                    style={{ width: '95%', marginBottom: 20, marginTop: 20, alignItems: "center" }}
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
                            </View> : null}

                        {/*     UnitID INTEGER,ItemCategoryID INTEGER, ItemSubCategoryID INTEGER, SupplierID INTEGER, IsActive INTEGER DEFAULT 1 )', []); */}


                    </View>

                </ScrollView>

                <View style={styles.Footer}>
                    {/* <TouchableOpacity style={styles.footerTouchableOpcity}>
                        <View style={styles.FooterView}>
                            <MaterialCommunityIcons name="update" size={28} color="#fff" />
                        </View>
                    </TouchableOpacity> */}
                    <TouchableOpacity style={styles.footerTouchableOpcity}>
                        <View style={styles.FooterView}>
                            <MaterialCommunityIcons name="delete" size={28} color={colors.accent}
                                onPress={() => {
                                    Alert.alert(
                                        'Delete Item',
                                        'Are you Sure to Delete Item  ' + this.state.CustomerName + " ?",
                                        [
                                            { text: 'Cancel' },
                                            {
                                                text: 'Confrom',
                                                onPress: this.DeleteItem,
                                            },


                                        ],

                                    );
                                }}


                            />
                        </View>
                    </TouchableOpacity>
                </View>



            </View>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.textOnDark
    },
    textstyle: {
        marginLeft: 12, paddingTop: 12

    },
    textInputStyle: {
        borderBottomWidth: 1, borderColor: colors.primary, width: ('95%'), marginLeft: 12, height: 40, marginBottom: 12,
        fontSize: 18
    },
    pickerStyle: {
        height: 50, width: ('95%'), marginLeft: 12, marginBottom: 8, color: colors.primary
    },
    Footer: {
        height: 45,
        width: "100%",
        backgroundColor: colors.textOnDark,
        flexDirection: "row",
        alignContent: "center",
        alignItems: "center",
        position: 'absolute',
        bottom: 0,
    },
    footerTouchableOpcity: {
        width: "100%"
    },
    FooterView: {
        alignItems: "center",
        alignContent: "center",
        textAlign: "center",
    },
    view1: {
        borderWidth: 1,
        borderRadius: 8,
        borderColor: colors.textOnDark,
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
    //  icon:{
    //    marginRight: 20,
    //     justifyContent: 'flex-start',
    //     alignItems: 'flex-end',
    //  }

});
