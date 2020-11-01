import React, { Fragment, useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput } from 'react-native';
import { Button } from 'native-base';

import colors from '../config/colors';
import Layout from '../components/Layout';
import cache from '../utility/cache'

function HomeScreen({ navigation, route }) {
    const [teamName, setTeamName] = useState('');
    const [meetCount, setMeetCount] = useState(0);

    const storeTeamName = async () => {
        await cache.store('TeamName', teamName);
    };

    const storeMeetCount = async () => {
        const count = meetCount;
        setMeetCount(count + 1);
        await cache.store('MeetCount', count + 1);
    };

    useEffect(() => {
        async function fetchData() {
            const name = await cache.get('TeamName');
            setTeamName(name);
            const count = await cache.get('MeetCount');
            if (count) {
                setMeetCount(count);
            }
        }
        fetchData();
    }, [route.params]);

    return (
        <Layout
            title="Home"
            footer={
                <Fragment>
                    <Button full
                        disabled={teamName ? false : true}
                        onPress={() => {
                            const count = meetCount + 1;
                            storeMeetCount();
                            navigation.navigate('Meet', { new: true, count })
                        }}>
                        <Text> New </Text>
                    </Button>
                    <Button full
                        disabled={teamName && meetCount > 0 ? false : true}
                        onPress={() => navigation.navigate('Meet', { count: meetCount })}>
                        <Text> Edit </Text>
                    </Button>
                    <Button full
                        disabled={teamName && meetCount > 0 ? false : true}
                        onPress={() => navigation.navigate('Report')}>
                        <Text> Graph </Text>
                    </Button>
                </Fragment>
            }>
            <View
                style={styles.container}>
                <Text style={styles.text}>{'\n'}{'\n'}
                    {'Welcome Team'}
                </Text>
                <View>
                    <TextInput
                        placeholder={'name'}
                        defaultValue={teamName ? teamName : undefined}
                        style={styles.input}
                        onChangeText={(text) => {
                            setTeamName(text);
                        }}
                        onEndEditing={(text) => {
                            storeTeamName();
                        }}
                    />
                </View>
            </View>
        </Layout>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#65909d"
    },
    text: {
        fontSize: 25,
        fontWeight: "bold",
        color: colors.white

    },
    input: {
        alignSelf: "stretch",
        flexDirection: "row",
        height: 40,
        width: "100%",
        fontSize: 20,
        borderColor: "#333",
        borderBottomWidth: 1,
        padding: 10
    }
});

export default HomeScreen;