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
import { colors } from '../theme';

export default class Invoice_Screen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            temp: [],
            tempMaxInvID: null,
            CompanyName: null,
            FlateListSearchItem: [],
            TempFlateListItem: [],
            selectedItem: [],
            customersName: [],
            Item: [],
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
            itemCurrentstock: 0,
            assOfDate: null,
            selloncash: true,


            selectedUnit: null,
            selectedCustomer: null,
            selectedItemCategory: null,
            isVisibleView1: true,
            isVisibleView2: true,
            istext1Visble: false,
            istext2Visble: true,
            isVisiblecancelbutton: false,



        }
        AsyncStorage.getItem('CurrentCompanyName', (err, result) => {
            if (result !== null) {
                var abc = result;
                this.setState({ CompanyName: abc });
            }

        });
        this.Search();
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
              date + '-' + month + '-' + year ,
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
                        'DELETE FROM TempInvoiceItems',
                        [],
                        (tx, results) => {
                            //             alert(results.rowsAffected
                            //  );
                            console.log('Results', results.rowsAffected);
                            if (results.rowsAffected > 0) {
                                this.setState({ istext1Visble: true })
                                this.setState({ isVisibleView2: false })
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
                    tx.executeSql('SELECT * FROM Customers where IsActive =1', [], (tx, results) => {
                        var temp = [];
                        for (let i = 0; i < results.rows.length; ++i) {
                            temp.push(results.rows.item(i));
                        }
                        console.log(temp);
                        this.setState({
                            customersName: temp,
                        });
                    });
                });

                db.transaction(tx => {
                    tx.executeSql('SELECT * FROM InventoryItems where IsActive =1', [], (tx, results) => {
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

    TempInvoiceValues = () => {

        AsyncStorage.getItem('CurrentCompanyName', (err, result) => {
            if (result !== null) {
                var abc = result;
                this.setState({ ComapanyName: abc });
                var db_name = abc + ".db";
                db_name = db_name.replace(/\s/g, '');
                var db = openDatabase({ name: db_name });
                db.transaction(tx => {
                    tx.executeSql('SELECT * FROM TempInvoiceItems ',
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

    CustomerList = () => {
        return (this.state.customersName.map((x, i) => {
            return (<Picker.Item label={x.CustomerName} key={i} value={x.CustomerID} />)
        }));
    }

    ItemsList = () => {
        return (this.state.Item.map((x, i) => {
            return (<Picker.Item label={x.ItemName} key={i} value={x.ItemID} />)
        }));
    }

    onText1Press = () => {

        this.setState({ istext1Visble: false })
        this.setState({ isVisibleView2: true })
    }

    onSelect = () => {

        if (this.state.itemID === null) {
            alert("please select item from above for Sell")
        }
        else {

            if (this.state.itemCurrentstock < this.state.Quantity) {
                alert("you have only " + this.state.itemCurrentstock + " peices of " + this.state.itemName + " In you Stcok")
            } else {


                AsyncStorage.getItem('CurrentCompanyName', (err, result) => {
                    if (result !== null) {
                        var abc = result;
                        this.setState({ ComapanyName: abc });
                        var db_name = abc + ".db";
                        db_name = db_name.replace(/\s/g, '');
                        var db = openDatabase({ name: db_name });
                        db.transaction(tx => {
                            tx.executeSql(
                                'SELECT * FROM  TempInvoiceItems where  ItemID=?',
                                [this.state.itemID],
                                (tx, results) => {
                                    if (results.rows.length > 0) {
                                        var temp = results.rows.item(0);
                                        { this.state.itemsTotolAmount = this.state.itemsTotolAmount - (temp.ItemQuantity * temp.PerUnitSellprice) }
                                        db.transaction(tx => {
                                            tx.executeSql(
                                                'UPDATE  TempInvoiceItems set  ItemName =?, ItemQuantity=?, PerUnitSellprice=?, CurrentStock=? where ItemID=?',
                                                [this.state.itemName, this.state.Quantity, this.state.perUnitSellingCost, this.state.itemCurrentstock, this.state.itemID],
                                                (tx, results) => {
                                                    //             alert(results.rowsAffected
                                                    //  );
                                                    { this.state.itemsTotolAmount = this.state.itemsTotolAmount + (this.state.Quantity * this.state.perUnitSellingCost) }

                                                    console.log('Results', results.rowsAffected);
                                                    if (results.rowsAffected > 0) {
                                                        this.state.FlateListSearchItem = null;
                                                        this.state.itemID = null;
                                                        this.state.itemName = null;
                                                        this.state.itemCurrentstock = null;
                                                        this.state.perUnitSellingCost = null;
                                                        this.state.Quantity = "1";
                                                        this.setState({ istext1Visble: true })
                                                        this.setState({ isVisibleView2: false })
                                                        this.setState({ isVisibleView1: true });
                                                        this.TempInvoiceValues();
                                                    }
                                                    else {
                                                        alert('Registration Failed');
                                                    }
                                                }
                                            );


                                        });
                                    }
                                    else {
                                        { this.state.itemsTotolAmount = this.state.itemsTotolAmount + (this.state.Quantity * this.state.perUnitSellingCost) }

                                        db.transaction(tx => {
                                            tx.executeSql(
                                                'INSERT INTO TempInvoiceItems( ItemID, ItemName, ItemQuantity, PerUnitSellprice, CurrentStock) VALUES (?,?,?,?,?)',
                                                [this.state.itemID, this.state.itemName, this.state.Quantity, this.state.perUnitSellingCost, this.state.itemCurrentstock],
                                                (tx, results) => {
                                                    //             alert(results.rowsAffected
                                                    //  );
                                                    console.log('Results', results.rowsAffected);
                                                    if (results.rowsAffected > 0) {
                                                        this.state.FlateListSearchItem = null;
                                                        this.state.itemID = null;
                                                        this.state.itemName = null;
                                                        this.state.itemCurrentstock = null;
                                                        this.state.perUnitSellingCost = null;
                                                        this.state.Quantity = "1";
                                                        this.setState({ istext1Visble: true })
                                                        this.setState({ isVisibleView2: false })
                                                        this.setState({ isVisibleView1: true });
                                                        this.setState({ isVisiblecancelbutton: true });

                                                        this.TempInvoiceValues();
                                                    }
                                                    else {
                                                        alert('Registration Failed');
                                                    }
                                                }
                                            );


                                        });
                                    }
                                }
                            );


                        });

                    }
                });
            }



        }




    }

    onCancel = () => {
        this.state.FlateListSearchItem = null;
        this.state.itemID = null;
        this.state.itemName = null;
        this.state.itemCurrentstock = null;
        this.state.perUnitSellingCost = null;
        this.state.Quantity = "1";
        this.setState({ istext1Visble: true })
        this.setState({ isVisibleView2: false })
        this.setState({ isVisibleView1: true });

    }

    onSave = () => {
        var tempselloncash;
        if (this.state.selloncash) {
            tempselloncash = 1;
        }
        else {
            tempselloncash = 0;
        }

        if (this.state.assOfDate !== null) {
            if (this.state.selectedCustomer !== null && this.state.selectedCustomer !== "0") {
                ////////////////////main invoice table///////////////////
                // alert("Selected Customer  :"+this.state.selectedCustomer+"   Date:"+this.state.assOfDate+"    totalAmount:"+this.state.itemsTotolAmount+"   Oncash:"+tempselloncash)

                AsyncStorage.getItem('CurrentCompanyName', (err, result) => {
                    if (result !== null) {
                        var abc = result;
                        this.setState({ ComapanyName: abc });
                        var db_name = abc + ".db";
                        db_name = db_name.replace(/\s/g, '');
                        var db = openDatabase({ name: db_name });
                        db.transaction(tx => {

                            tx.executeSql(
                                'SELECT * FROM Customers where  CustomerID = ? AND IsActive =1 ',
                                [this.state.selectedCustomer],
                                (tx, results) => {
                                    if (results.rows.length > 0) {
                                        var temp=results.rows.item(0);
                                     
                                        tx.executeSql(
                                            'INSERT INTO Invoices( CustomerID,CustomerName, Date, TotalAmmount, OnCash) VALUES (?,?,?,?,?)',
                                            [this.state.selectedCustomer,temp.CustomerName, this.state.assOfDate, this.state.itemsTotolAmount, tempselloncash],
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
                                        alert('Registration Failed');
                                    }
                                }
                            );
                        });


                    }
                });




                ///////////////////////////////////////main invoice table finish//////////////////

            }
            else {
                alert("Please Select Customer")
            }
        }
        else {
            alert("Please select date");
        }





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
                        'Select MAX(InvoiceID) as MAXID FROM Invoices',
                        [],
                        (tx, results) => {
                            var tempmaxid = results.rows.item(0)
                            if (results.rows.length > 0) {
                                this.setState({
                                    tempMaxInvID: tempmaxid.MAXID,
                                })
                            }
                        }
                    );
                });

                db.transaction(tx => {
                    tx.executeSql('SELECT * FROM TempInvoiceItems ',
                        [], (tx, results) => {
                            for (let i = 0; i < results.rows.length; ++i) {
                                var temp = [];
                                temp = results.rows.item(i);

                                // console.log(temp.ItemName);
                                //////////////////insert into invoice details///////////////////


                                tx.executeSql(
                                    'INSERT INTO InvoiceDetails( ItemID, ItemName,  InvoiceID, ItemQuantity,PerUnitSellprice,Date) VALUES (?,?,?,?,?,?)',
                                    [temp.ItemID, temp.ItemName, this.state.tempMaxInvID, temp.ItemQuantity, temp.PerUnitSellprice, this.state.assOfDate],
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


                        });
                });
            }
        });



        this.updateInventory();

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
                    tx.executeSql('SELECT * FROM TempInvoiceItems ',
                        [], (tx, results) => {
                            for (let i = 0; i < results.rows.length; ++i) {
                                var temp = [];
                                temp = results.rows.item(i);
                                var tempupdatedstock = temp.CurrentStock - temp.ItemQuantity;
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
                        'DELETE FROM TempInvoiceItems',
                        [],
                        (tx, results) => {


                        }
                    );


                });


            }
        });


        Alert.alert("Success", "Transection Compeleted ",
            [
                { text: "Ok", onPress: () => this.handelExit() }], { cancelable: false });


    }
    Search = (text) => {
        this.setState({ isVisibleView1: true });
        this.setState({ SearchItemName: text });
        AsyncStorage.getItem('CurrentCompanyName', (err, result) => {

            if (result !== null) {
                var abc = result;
                this.setState({ ComapanyName: abc });
                // alert(this.state.ComapanyName);

                var db_name = abc + ".db";
                db_name = db_name.replace(/\s/g, '');
                var db = openDatabase({ name: db_name });
                var temp = '%' + this.state.SearchItemName + '%';

                db.transaction(tx => {
                    tx.executeSql('SELECT * FROM InventoryItems where (ItemName LIKE ? OR ItemBarcode Like ? ) AND IsActive =1  ',
                        [temp, temp], (tx, results) => {
                            var temp = [];
                            for (let i = 0; i < results.rows.length; ++i) {
                                temp.push(results.rows.item(i));
                            }
                            this.setState({
                                FlateListSearchItem: temp,
                            });
                        });
                });
            }
        });
    }

    selectFun = (item) => {
        var tem = item.ItemID;
        this.state.itemID = item.ItemID;
        this.state.itemName = item.ItemName;
        this.state.itemCurrentstock = item.CurrentStock;
        this.state.perUnitSellingCost = item.PerUnitSellprice;
        this.setState({ isVisibleView1: false });
    }

    ondelet = (item) => {
        var temp = item.ItemID;
        var tempqun = item.ItemQuantity;
        var temprice = item.PerUnitSellprice;
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
                        'DELETE FROM TempInvoiceItems  where ItemID=?',
                        [temp],
                        (tx, results) => {
                            //             alert(results.rowsAffected
                            //  );
                            console.log('Results', results.rowsAffected);
                            if (results.rowsAffected > 0) {
                                this.TempInvoiceValues();
                            }

                        }
                    );


                });
            }
        });

    }
    render() {
        return (
            <ScrollView style={styles.container}>
                <MyHeader

                    title={"Invoice"}
                    rightIcon={"save"}
                    backGroundColor={colors.primary}
                    go={this.InsertItemName}
                // go={() => this.props.navigation.navigate('INVENTORY')}
                />
                {/* /////////////////////////////////////VIEW 1 BASCI DETAILS//////////////////////////////////// */}
                {this.state.istext1Visble ?
                    <View style={styles.view1}>
                        <View style={{ width: '100%', backgroundColor: colors.primaryLight, flexDirection: "row" }}>
                            <Text style={{ fontSize: 20, color: colors.textOnDark, marginLeft: 24, textAlignVertical: "center" }}>Name</Text>
                            <Text style={{ fontSize: 20, color: colors.onPrimary, marginLeft: 50, textAlignVertical: "center" }}>QUNTITY</Text>
                            <Text style={{ fontSize: 20, color: colors.textOnDark, marginLeft: 32, textAlignVertical: "center" }}>PRICE</Text>
                        </View>


                        <FlatList style={styles.flatelistStyle}
                            data={this.state.TempFlateListItem}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item }) => (

                                <View key={item.ItemID} style={styles.flatelistViewStyle}>

                                    <TouchableOpacity style={styles.buttonStyle1}  >
                                        <View style={{ flexDirection: "row" }}>
                                            <View style={{ width: 150, justifyContent: "center", backgroundColor: colors.primaryLight }}>
                                                <Text style={{ fontSize: 20, color: colors.textOnDark, marginLeft: '10%' }}>{item.ItemName}</Text>
                                            </View>
                                            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: colors.primaryLight, width: 150 }}>
                                                <Text style={{ fontSize: 18, color: colors.onPrimary, marginLeft: '10%', width: 20 }}> {item.ItemQuantity}   </Text>
                                                <Text style={{ fontSize: 18, color: colors.textOnDark, marginLeft: '10%', width: 80 }}>    {item.PerUnitSellprice * item.ItemQuantity}</Text>
                                            </View>
                                            <TouchableOpacity style={{ marginLeft: '5%' }} onPress={() => { this.ondelet(item) }}  >
                                                <MaterialCommunityIcons name="delete" size={28} color="#fff" />
                                            </TouchableOpacity>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            )}
                        />
                    </View> : null}

                {/* /////////////////////////////////////// */}
                {/* //////////view 1 finnish ////////////// */}

                {this.state.istext1Visble ?
                    <View style={styles.view1}>
                        <Text style={{ marginTop: 8, marginLeft: 20 }}>Deatils</Text>
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
                                <Text style={styles.textstyle}>  Select Customer</Text>
                                <Picker
                                    selectedValue={this.state.selectedCustomer}
                                    style={[styles.pickerStyle]}
                                    onValueChange={(value) => {
                                        (this.setState({ selectedCustomer: value }))
                                    }}
                                >
                                    <Picker.Item label='select an option...' value='0' />
                                    {this.CustomerList()}

                                </Picker>
                            </View>

                            <View style={{ flexDirection: "row", justifyContent: "space-evenly", }}>

                                <Text style={styles.textstyle} >Total : {this.state.itemsTotolAmount} Rs</Text>

                                <Text style={styles.textstyle} > ON Cash</Text>
                                <CheckBox
                                    value={this.state.selloncash}
                                    onValueChange={() => this.setState({ selloncash: !this.state.selloncash })}
                                />

                            </View>

                        </View>
                        {this.state.istext1Visble ?
                            <  TouchableOpacity style={styles.buttonStyle} onPress={this.onSave}>
                                <View >
                                    <Text style={styles.buttonTextStyle}>Save</Text>
                                </View>
                            </TouchableOpacity>
                            : null}
                    </View>
                    : null}






                {this.state.istext1Visble ?
                    <TouchableOpacity onPress={() => { this.onText1Press(); this.Search(""); }}>
                        <Text style={{ fontSize: 14, color: 'gray', margin: 12, }}> + ADD MORE ITEM /UPDATE </Text>
                    </TouchableOpacity>
                    : null}
                {this.state.isVisibleView2 ?
                    <View style={styles.view3}>
                        <Text>
                            Add Item
                    </Text>

                        <TextInput style={styles.SearchTextInput} placeholder=" Item Name / Barcode" onChangeText={this.Search} />
                        <View style={styles.view1}>
                            <View style={{ width: '100%', backgroundColor: colors.primaryLight, flexDirection: "row", alignItems: "center" }}>
                                <Text style={{ fontSize: 20, color: colors.onPrimary, marginLeft: 24 }}>Name</Text>
                                <Text style={{ fontSize: 18, color: colors.onPrimary, marginLeft: 120 }}>STOCK</Text>
                                <Text style={{ fontSize: 18, color: colors.onPrimary, marginLeft: 40 }}>PRICE</Text>
                            </View>
                        </View>
                        {this.state.isVisibleView1 ?


                            <FlatList style={styles.flatelistStyle}
                                data={this.state.FlateListSearchItem}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({ item }) => (
                                    <View key={item.ItemID} style={styles.flatelistViewStyle}>
                                        <TouchableOpacity style={styles.buttonStyle1} onPress={() => { this.selectFun(item) }} >
                                            <View style={{ flexDirection: "row" }}>
                                                <View style={{ width: 200, justifyContent: "center", backgroundColor: "#0a" }}>
                                                    <Text style={{ fontSize: 20, color: colors.textOnDark, marginLeft: '10%' }}>{item.ItemName}</Text>
                                                </View>
                                                <View style={{ flexDirection: "row", justifyContent: "space-around", alignItems: "center", backgroundColor: colors.primaryLight, width: 150 }}>
                                                    <Text style={{ fontSize: 18, color: colors.onPrimary, }}> {item.CurrentStock}   </Text>
                                                    <Text style={{ fontSize: 16, color: colors.textOnDark }}>   {item.PerUnitSellprice}</Text>
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                )}
                            />
                            : <TouchableOpacity style={[styles.buttonStyle1, { marginTop: 200 }]}   >
                                <View style={{ flexDirection: "row" }}>
                                    <View style={{ width: 130, justifyContent: "center", backgroundColor: colors.primaryLight }}>
                                        <Text style={{ fontSize: 20, color: colors.textOnDark, marginLeft: '10%' }}>{this.state.itemName}</Text>
                                    </View>
                                    <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", backgroundColor: colors.primaryLight, width: 170 }}>
                                        <Text style={{ fontSize: 18, color: colors.onPrimary, marginLeft: '10%' }}>Stock: {this.state.itemCurrentstock}   </Text>
                                        <Text style={{ fontSize: 16, color: colors.textOnDark }}>   Sell Price   :  {this.state.perUnitSellingCost}</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        }

                        <View style={{ flexDirection: "row", justifyContent: "space-evenly", marginTop: 20, alignItems: "center" }}>
                            <Text>
                                Quantity
                    </Text>
                            <TextInput style={{ borderWidth: 1, width: 90, height: 40 }}
                                value={this.state.Quantity}
                                keyboardType="number-pad"
                                onChangeText={(text) => { this.setState({ Quantity: text }) }}
                            />
                        </View>
                        <Text style={{ textAlign: "center" }}>
                            Total Amount = {this.state.Quantity * this.state.perUnitSellingCost} Rs
                    </Text>

                        <View style={{ flexDirection: "row", justifyContent: "space-around", marginTop: 12 }}>
                            {this.state.isVisiblecancelbutton ?
                                <  TouchableOpacity style={styles.buttonStyle} onPress={this.onCancel}>
                                    <View >
                                        <Text style={styles.buttonTextStyle}>Cancel</Text>
                                    </View>
                                </TouchableOpacity> : null
                            }
                            <  TouchableOpacity style={styles.buttonStyle} onPress={this.onSelect}>
                                <View >
                                    <Text style={styles.buttonTextStyle}>Select</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View> : null}
            </ScrollView>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    textstyle: {
        marginLeft: 12, paddingTop: 12
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
        width: 350,
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
        marginBottom: 8,
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
        height: 250,
        alignSelf: "center",
        marginTop: 12,
        marginBottom: 12,
        paddingBottom: 8,
        marginLeft: 8,
        marginRight: 8,

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
