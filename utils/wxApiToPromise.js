/**
 * @file 提供小程 wx-api promise 化
 * @author tang
 */

export const getUserWxInfo = () => new Promise((success, fail) => {
    wx.getUserInfo({success, fail});
});


export const openUserSetting = () => new Promise((success, fail) => {
    wx.openSetting({success, fail})
});


export const getImageInfo = (src) => new Promise((success, fail) => {
    wx.getImageInfo({src, success, fail});
});

export const chooseImage = (req) => new Promise((success, fail) => {
    wx.chooseImage({...req, success, fail});
})

export const wxApiToPromise = (wxApiName) => () => new Promise((success, fail) => {
    wx[wxApiName]({success, fail});
});

