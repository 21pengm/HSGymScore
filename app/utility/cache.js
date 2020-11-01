import AsyncStorage from '@react-native-community/async-storage';

const prefix = 'HSGymScore_';
const store = async (key, value) => {
    try {
        await AsyncStorage.setItem(prefix + key, JSON.stringify(value));
    } catch (error) {
        console.log(error);
    }
};

const get = async (key) => {
    let value;
    try {
        const data = await AsyncStorage.getItem(prefix + key);
        value = JSON.parse(data);
    } catch (error) {
        console.log(error);
    }
    return value;
};

const remove = async (key) => {
    try {
        await AsyncStorage.removeItem(prefix + key);
    } catch (error) {
        console.log(error);
    }
};

const clear = async () => {
  AsyncStorage.clear();
};

export default {
    store,
    get,
    remove,
    clear
}