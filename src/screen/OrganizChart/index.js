import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Collapsible from 'react-native-collapsible';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useSelector } from 'react-redux';
import { AppStyle } from '../../assets/style/AppStyle';
import NewHeader from '../../components/NewHeader';
import { baseUrl } from '../../services';
import { EncryptUrl } from '../../services/EncryptUrl';

const OrganizChart = props => {
  const [childCollapsed, setChildCollapsed] = useState(true);
  const [childdCollapsed, setChilddCollapsed] = useState(true);
  const [depCollapsed, setDepCollapsed] = useState(true);
  const [colCollapsed, setColCollapsed] = useState(true);
  const [state, setState] = useState({
    chartData: [],
    formData: {},
  });
  const accessToken = useSelector(state => state.LoginReducer.accessToken);

  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      let mUrl = `${baseUrl}/api/call/all.requests/organisation_development_api`;
      (async () => {
        let secretUrl = await EncryptUrl(mUrl);

        fetch(secretUrl, {
          method: 'POST',
          headers: {
            Authorization: 'Bearer ' + accessToken,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        })
          .then(response => response.json())
          .then(data => setState({ ...state, chartData: data }))
          .catch(function() {
            // console.log('error');
          });
      })();
    });
    // console.log("\n\n\n CHARTDATA \n\n\n", state.chartData)
  });

  const renderChild1 = item => {
    return (
      <View>
        <View style={{ flexDirection: 'row-reverse', right: 10 }}>
          {state.chartData &&
            state.chartData.map(item => {
              return (
                <TouchableOpacity
                  onPress={() => setChildCollapsed(!childCollapsed)}
                  // style={styles.directManagerContainer}
                  style={AppStyle.employeeItem}
                >
                  <Icon
                    size={25}
                    color={'#007598'}
                    name={childCollapsed ? 'add-circle' : 'remove-circle'}
                  />
                  {/* <View style={styles.newsDataContainer}>
                            <View style={{ flexDirection: "row" }}> */}

                  <View style={{ flexDirection: 'column', marginRight: 20 }}>
                    <View
                      style={{
                        top: -10,
                      }}
                    >
                      <Text
                        style={{
                          backgroundColor: '#008AC5',
                          borderRadius: 10,
                          alignItems: 'center',
                          paddingHorizontal: 8,
                          marginTop: 20,
                          paddingVertical: 3,
                          textAlign: 'right',
                          fontFamily: '29LTAzer-Regular',
                          fontSize: 14,
                          color: 'white',
                        }}
                      >
                        {item.job}
                      </Text>
                    </View>
                    <View>
                      <Text
                        numberOfLines={2}
                        style={styles.newsDataDescription}
                      >
                        {/* {item.resume} */}
                        CHILD11
                      </Text>
                    </View>
                  </View>
                  <View style={{ marginRight: 20, top: 10 }}>
                    <Image
                      source={require('../../assets/images/user.png')}
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 40,
                        backgroundColor: 'white',
                      }}
                      resizeMode="cover"
                    />
                  </View>
                </TouchableOpacity>
              );
            })}

          {/* <TouchableOpacity
                        onPress={() => setChildCollapsed(!childCollapsed)}
                        style={AppStyle.employeeItem}
                    >
                        <Icon
                            size={25}
                            color={"#007598"}
                            name={childCollapsed ? "add-circle" : "remove-circle"}
                        />
                      
                        {state.chartData && state.chartData.map((item) => {
                            console.log("\n\n\n state \n\n\n", item);

                            return (<View style={{ flexDirection: "column", marginRight: 20, }}>
                                <View style={{
                                    top: -10
                                }}>
                                    <Text key={item} style={{
                                        backgroundColor: "#008AC5",
                                        borderRadius: 10,
                                        alignItems: "center",
                                        paddingHorizontal: 8,
                                        marginTop: 20,
                                        paddingVertical: 3,
                                        textAlign: "right",
                                        fontFamily: "29LTAzer-Regular",
                                        fontSize: 14,
                                        color: "white",
                                    }}>
                                        {item.job}
                                    </Text>
                                </View>
                                <View >
                                    <Text key={item} numberOfLines={2} style={styles.newsDataDescription}>
                                        {item.manager}
                                        CHILD11
                                    </Text>
                                </View>
                            </View>)
                        })}


                        
                        <View style={{ marginRight: 20, top: 10 }}>

                            <Image
                                source={require("../../assets/images/user.png")}
                                style={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: 40,
                                    backgroundColor: "white",
                                }}
                                resizeMode="cover"
                            />
                        </View>

                    </TouchableOpacity> */}
        </View>
        <Collapsible
          easing={'linear'}
          duration={600}
          collapsed={childCollapsed}
        >
          <View>{renderChild2()}</View>
        </Collapsible>
      </View>
    );
  };
  const renderChild2 = item => {
    return (
      <View>
        <View style={{ flexDirection: 'row-reverse', right: 10 }}>
          <TouchableOpacity
            onPress={() => setDepCollapsed(!depCollapsed)}
            // style={styles.directManagerContainer}
            style={AppStyle.employeeItem}
          >
            <Icon
              size={25}
              color={'#007598'}
              name={depCollapsed ? 'add-circle' : 'remove-circle'}
            />
            {/* <View style={styles.newsDataContainer}>
                            <View style={{ flexDirection: "row" }}> */}
            <View style={{ flexDirection: 'column', marginRight: 20 }}>
              <View
                style={{
                  top: -10,
                }}
              >
                <Text
                  style={{
                    backgroundColor: '#008AC5',
                    borderRadius: 10,
                    alignItems: 'center',
                    paddingHorizontal: 8,
                    marginTop: 20,
                    paddingVertical: 3,
                    textAlign: 'right',
                    fontFamily: '29LTAzer-Regular',
                    fontSize: 14,
                    color: 'white',
                  }}
                >
                  CHILD2
                </Text>
              </View>
              <View>
                <Text numberOfLines={2} style={styles.newsDataDescription}>
                  {/* {item.resume} */}
                  CHILD22
                </Text>
              </View>
            </View>
            <View style={{ marginRight: 20, top: 10 }}>
              <Image
                source={require('../../assets/images/user.png')}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 40,
                  backgroundColor: 'white',
                }}
                resizeMode="cover"
              />
            </View>
          </TouchableOpacity>
        </View>
        <Collapsible easing={'linear'} duration={600} collapsed={depCollapsed}>
          <View>{renderChild3()}</View>
        </Collapsible>
      </View>
    );
  };
  const renderChild3 = item => {
    return (
      <View>
        <View style={{ flexDirection: 'row-reverse', right: 10 }}>
          <TouchableOpacity
            onPress={() => setChilddCollapsed(!childdCollapsed)}
            // style={styles.directManagerContainer}
            style={AppStyle.employeeItem}
          >
            <Icon
              size={25}
              color={'#007598'}
              name={childdCollapsed ? 'add-circle' : 'remove-circle'}
            />
            {/* <View style={styles.newsDataContainer}>
                            <View style={{ flexDirection: "row" }}> */}
            <View style={{ flexDirection: 'column', marginRight: 20 }}>
              <View
                style={{
                  top: -10,
                }}
              >
                <Text
                  style={{
                    backgroundColor: '#008AC5',
                    borderRadius: 10,
                    alignItems: 'center',
                    paddingHorizontal: 8,
                    marginTop: 20,
                    paddingVertical: 3,
                    textAlign: 'right',
                    fontFamily: '29LTAzer-Regular',
                    fontSize: 14,
                    color: 'white',
                  }}
                >
                  CHILD2
                </Text>
              </View>
              <View>
                <Text numberOfLines={2} style={styles.newsDataDescription}>
                  {/* {item.resume} */}
                  CHILD22
                </Text>
              </View>
            </View>
            <View style={{ marginRight: 20, top: 10 }}>
              <Image
                source={require('../../assets/images/user.png')}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 40,
                  backgroundColor: 'white',
                }}
                resizeMode="cover"
              />
            </View>
          </TouchableOpacity>
        </View>
        <Collapsible
          easing={'linear'}
          duration={600}
          collapsed={!childdCollapsed}
        >
          <View style={{ flexDirection: 'row-reverse', right: 10 }}>
            <View style={AppStyle.employeeItem}>
              <Text>CHILD4</Text>
            </View>
          </View>
        </Collapsible>
      </View>
    );
  };
  return (
    <LinearGradient colors={['#d5e6ed', '#d5e6ed']} style={{ flex: 1 }}>
      <NewHeader
        {...props}
        back={true}
        style={styles.titleFont}
        title="الهيكل التنظيمي"
      />
      <View style={{ flexDirection: 'column' }}>
        <View
          style={{
            padding: 8,
            backgroundColor: '#ffffff',
            borderRadius: 8,
            marginBottom: 16,
            width: '95%',
            flexDirection: 'row-reverse',
            alignSelf: 'flex-end',
            // alignItems: "center",
            // justifyContent: "center",
            right: 10,
            top: 15,
          }}
        >
          <TouchableOpacity
            onPress={() => setColCollapsed(!colCollapsed)}
            // style={styles.directManagerContainer}
            style={styles.directManagerContainer}
          >
            <Icon
              size={25}
              color={'#007598'}
              name={colCollapsed ? 'add-circle' : 'remove-circle'}
            />
            <Text style={{ textAlign: 'center' }}>TESSSST</Text>
          </TouchableOpacity>
        </View>
        <View style={{ top: 13 }}>
          <Collapsible
            easing={'linear'}
            duration={600}
            collapsed={colCollapsed}
          >
            <View>
              {renderChild1()}

              {/* <Text>test222</Text> */}
            </View>
          </Collapsible>
        </View>
      </View>
    </LinearGradient>
  );
};
export default OrganizChart;

const styles = StyleSheet.create({
  titleFont: {
    fontFamily: '29LTAzer-Regular',
  },
  directManagerContainer: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  FamilyContentContainer: {
    width: '80%',
    alignItems: 'flex-end',
  },
  newsDateText: {
    fontSize: 10,
    textAlign: 'right',
    color: 'gray',
    padding: 5,
  },
  FamilydateText: {
    fontFamily: '29LTAzer-Regular',
    fontSize: 12,
    lineHeight: 18,
    color: '#18ab91',
  },
  FamilyIconContainer: {
    width: '20%',
    alignItems: 'center',
  },
  directmanagerIconContainer: {
    borderRadius: 50,
    width: 35,
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  FamilyContentText: {
    textAlign: 'right',
    fontFamily: '29LTAzer-Regular',
    fontSize: 14,
    lineHeight: 18,
    color: '#20547a',
  },
  FamilyContentContainer: {
    width: '80%',
    alignItems: 'flex-end',
  },
  newsDataImageContainer: {
    //    left:0,
    // left: 0,
    // flex: 1,
    // flex: 1,
    // backgroundColor: "#008AC5",

    flexDirection: 'row',
  },
  container: {
    flex: 1,
    padding: 20,
    // paddingTop: 65,
    // backgroundColor: "white",
  },
  list: {
    flex: 1,
    marginTop: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  descriptionContainer: {
    flexDirection: 'row',
    paddingRight: 50,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  textDescription: {
    marginLeft: 10,
    color: 'gray',
  },
  newsDataDescription: {
    textAlign: 'right',
    fontFamily: '29LTAzer-Regular',
    fontSize: 14,
    lineHeight: 18,
    color: '#20547a',
  },
});
