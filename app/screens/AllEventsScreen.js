import React, { Fragment, useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
import { Button } from 'native-base';

import colors from '../config/colors';
import Layout from '../components/Layout';
import cache from '../utility/cache'

function AllEventsScreen({ navigation, route }) {
    const [allEventScores, setAllEventScores] = useState([0, 0, 0, 0]);
    const [totalScore, setTotalScore] = useState(0);
    const [eventName] = useState(['Vault', 'Bars', 'Beam', 'Floor']);
    const [newMeet] = useState(route.params?.new ? true : false);

    const storeTotalScore = async () => {
        const count = route.params.count;
        await cache.store(`${count}:TotalScore`, totalScore);
    };

    useEffect(() => {
        async function fetchData() {
            getAllScores();
        }
        if (newMeet) {
            clearAllScores();
            if (route.params?.new) {
                delete route.params.new;
            }
        } else {
            fetchData();
        }
    }, [newMeet]);

    const getAllScores = async () => {
        let it;
        let allScores = [];
        let totalS = 0;
        for (it = 0; it < 4; it++) {
            let index;
            let event = eventName[it];
            let scores = [];
            for (index = 0; index < 6; index++) {
                const data = await cache.get(`${event}:${index}`);
                if (data) {
                    const strs = data.split(':');
                    scores[index] = strs[1];
                } else {
                    scores[index] = '0';
                }
            }
            scores.sort((a, b) => {
                const av = parseFloat(a);
                const bv = parseFloat(b);

                if (av > bv) return -1;
                if (av < bv) return 1;
                return 0;
            });
            let sum = 0.0;
            scores.map((rowData, index) => {
                if (index < 4) {
                    sum += parseFloat(rowData)
                }
            });
            allScores.push(round3(sum));
            totalS += sum;
        }
        setAllEventScores(allScores);
        setTotalScore(round3(totalS));
    };

    const getEventScores = async (event) => {
        let it;
        allScores = allEventScores;
        let totalS = 0;
        for (it = 0; it < 4; it++) {
            if (eventName[it] === event) {
                let index;
                let scores = [];
                for (index = 0; index < 6; index++) {
                    const data = await cache.get(`${event}:${index}`);
                    if (data) {
                        const strs = data.split(':');
                        scores[index] = strs[1];
                    } else {
                        scores[index] = '0';
                    }
                }
                scores.sort((a, b) => {
                    const av = parseFloat(a);
                    const bv = parseFloat(b);

                    if (av > bv) return -1;
                    if (av < bv) return 1;
                    return 0;
                });
                let sum = 0.0;
                scores.map((rowData, index) => {
                    if (index < 4) {
                        sum += parseFloat(rowData)
                    }
                });
                allScores[it] = (round3(sum));
                totalS += sum;
            } else {
                totalS += parseFloat(allScores[it]);
            }
        }
        setAllEventScores(allScores);
        setTotalScore(round3(totalS));
    };

    const clearAllScores = async () => {
        let allScores = [];
        let totalS = 0;
        let it;
        for (it = 0; it < 4; it++) {
            allScores.push('0');
            let index;
            let event = eventName[it];
            for (index = 0; index < 6; index++) {
                await cache.remove(`${event}:${index}`);
            }
        }
        setAllEventScores(allScores);
        setTotalScore(round3(totalS));
    };

    const round3 = (text) => {
        let value = parseFloat(text);
        value = (Math.round(value * 1000) / 1000);
        return value.toString();
    };

    if (route.params?.event) {
        getEventScores(route.params.event);
        delete route.params.event;
    }

    return (
        <Layout
            title="All Events"
            footer={
                <Fragment>
                    <Button full onPress={() => {
                        storeTotalScore();
                        navigation.navigate('Meet'
                            , { count: route.params.count })
                    }}>
                        <Text> Back </Text>
                    </Button>
                    <Button full onPress={() => {
                        storeTotalScore();
                        navigation.navigate('Home',
                            { count: route.params.count })
                    }}>
                        <Text> Home </Text>
                    </Button>
                    <Button full onPress={() => {
                        storeTotalScore();
                        navigation.navigate('Result',
                            { total: totalScore, count: route.params.count })
                    }}>
                        <Text> Next </Text>
                    </Button>
                </Fragment>
            }>
            <View style={styles.container}>
                <View style={styles.logoContainer}>
                    <TouchableOpacity
                        style={styles.box}
                        onPress={() =>
                            navigation.navigate('Event', { event: 'Vault' })
                        }>
                        <Image
                            source={require('../assets/vault.png')}
                            resizeMode='contain'
                            style={styles.logo}
                        />
                        <Text style={{
                            color: colors.white,
                            fontSize: 30,
                            fontWeight: 'bold',
                        }}>{allEventScores[0]}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.box}
                        onPress={() =>
                            navigation.navigate('Event', { event: 'Bars' })
                        }>
                        <Image
                            source={require('../assets/bars.png')}
                            resizeMode='contain'
                            style={styles.logo}
                        />
                        <Text style={{
                            color: colors.white,
                            fontSize: 30,
                            fontWeight: 'bold',
                        }}>{allEventScores[1]}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.box}
                        onPress={() =>
                            navigation.navigate('Event', { event: 'Beam' })
                        }>
                        <Image
                            source={require('../assets/beam.png')}
                            resizeMode='contain'
                            style={styles.logo}
                        />
                        <Text style={{
                            color: colors.white,
                            fontSize: 30,
                            fontWeight: 'bold',
                        }}>{allEventScores[2]}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.box}
                        onPress={() =>
                            navigation.navigate('Event', { event: 'Floor' })
                        }>
                        <Image
                            source={require('../assets/floor.png')}
                            resizeMode='contain'
                            style={styles.logo}
                        />
                        <Text style={{
                            color: colors.white,
                            fontSize: 30,
                            fontWeight: 'bold',
                        }}>{allEventScores[3]}</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    style={styles.total}
                    onPress={() => {
                        storeTotalScore();
                        navigation.navigate('Result',
                            { total: totalScore, count: route.params.count })
                    }}>
                    <Text style={{
                        color: colors.white,
                        fontSize: 30,
                        fontWeight: 'bold',
                    }}>{'Total'}</Text>
                    <Text style={{
                        color: colors.white,
                        fontSize: 30,
                        fontWeight: 'bold',
                    }}>{totalScore}</Text>
                </TouchableOpacity>
            </View>
        </Layout >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white"
    },
    logo: {
        width: "100%",
        height: "65%",
    },
    logoContainer: {
        flex: 1,
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "center",
        padding: 2
    },
    box: {
        backgroundColor: "#85adb6",
        borderRadius: 15,
        justifyContent: "center",
        alignItems: "center",
        height: Dimensions.get('window').height / 3 - 25,
        width: Dimensions.get('window').width / 2 - 10,
        margin: 3,
    },
    total: {
        backgroundColor: "#85adb6",
        borderRadius: 15,
        justifyContent: "center",
        alignItems: "center",
        margin: 3,
        marginBottom: 30,
        width: Dimensions.get('window').width - 30,
    }
});

export default AllEventsScreen;