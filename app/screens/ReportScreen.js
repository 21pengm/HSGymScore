import React, { Fragment, useState, useEffect } from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import { Button } from 'native-base';
import { LineChart } from "react-native-chart-kit";

import Layout from '../components/Layout';
import cache from '../utility/cache'

function ReportScreen({ navigation }) {
    const [meetCount, setMeetCount] = useState(0);
    const [scores, setScores] = useState([]);
    const [dates, setDates] = useState([]);

    useEffect(() => {
        async function fetchData() {
            const count = await cache.get('MeetCount');
            if (count) {
                setMeetCount(count);

                let index;
                let data = [];
                for (index = 1; index <= count; index++) {
                    const value = await cache.get(`${index}:TotalScore`);
                    if (value) {
                        data.push(parseFloat(value));
                    } else {
                        data.push(0.0);
                    }
                }
                setScores(data);
                data = [];
                for (index = 1; index <= count; index++) {
                    const value = await cache.get(`${index}:Date`);
                    if (value) {
                        data.push(value);
                    } else {
                        data.push(' ');
                    }
                }
                setDates(data);
            }
        }
        fetchData();
    }, []);

    if (scores.length > 0) {
        const data = {
            labels: dates,
            datasets: [
                {
                    data: scores,
                    color: (opacity = 1) => `rgba(55, 65, 244, ${opacity})`,
                    strokeWidth: 5
                },
            ],
        };
        return (
            <Layout
                title="Report"
                footer={
                    <Fragment>
                        <Button full onPress={() => navigation.navigate('Home')}>
                            <Text> Home </Text>
                        </Button>
                    </Fragment>
                }>
                <View style={styles.container}>
                    <LineChart
                        data={data}
                        width={Dimensions.get("window").width}
                        height={220}
                        chartConfig={{
                            backgroundGradientFrom: "#c08189",
                            backgroundGradientTo: "#c08189",
                            decimalPlaces: 2,
                            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                            style: {
                                borderRadius: 16
                            },
                            propsForDots: {
                                r: "6",
                                strokeWidth: "2",
                                stroke: "#c08189"
                            }
                        }}
                    />
                </View>
            </Layout>
        );
    } else {
        return (
            <Layout
                title="Report"
                footer={
                    <Fragment>
                        <Button full onPress={() => navigation.navigate('Home')}>
                            <Text> Home </Text>
                        </Button>
                    </Fragment>
                }>
                <View style={styles.container}>
                </View>
            </Layout>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignContent: "stretch",
        backgroundColor: "#c08189"
    }
});

export default ReportScreen;