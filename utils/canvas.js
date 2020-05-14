/*eslint-disable*/
/*eslint camelcase: [2, {properties: "never"}]*/
/*globals Page,wx,getApp,Component,getCurrentPages*/

import {
    getImageInfo,
    chooseImage
} from './wxApiToPromise.js';

const initWidth = 560; //主图截取宽度
const initHeight = 560; //主图截取高度
const CANVASDATA = {
    width: 560,
    height: 830
}
const SLOGAN = {
    text: '投资进阶——罗尖老师の投资策略',
    color: '#000',
    fontStyle: 'bold 32px PingFangSC-Semibold',
    positionX: 30,
    positionY: 590,
}

//绘制圆角矩形（纯色填充）
function roundRectColor(context, x, y, w, h, r) {
    context.save();
    context.setFillStyle('#fff');
    context.setStrokeStyle('#fff')
    context.setLineJoin('round'); //交点设置成圆角
    context.setLineWidth(r);
    context.strokeRect(x + r / 2, y + r / 2, w - r, h - r);
    context.fillRect(x + r, y + r, w - r * 2, h - r * 2);
    context.stroke();
    context.closePath();
}

// 文本绘制
function drawText(context, text) {
    context.setFillStyle(text.color);
    context.font = text.fontStyle;
    context.textBaseline = 'top';
    context.fillText(text.text, text.positionX, text.positionY);
}

// 画线
function drawLine(ctx, line) {
    ctx.setLineDash([5, 6], 1);
    ctx.beginPath();
    ctx.setStrokeStyle(line.color);
    ctx.setLineWidth(line.width);
    ctx.moveTo(line.startPoint.x, line.startPoint.y);
    ctx.lineTo(line.endPoint.x, line.endPoint.y);
    ctx.stroke();
}

// getDetailDes 文本
function getDetailDes(imgCnt, videoCnt) {
    let imgDes = imgCnt > 0 ? `${imgCnt}张图片    ` : '';
    let videoDes = videoCnt > 0 ? `${videoCnt}个视频` : '';

    return imgDes + videoDes;
}

export const getPoster = function (canvasId, play_path, show_play, reqData) {
    let personPic;
    let clipWidth;
    let positionX = 0;
    let positionY = 0;
    return new Promise((success, fail) => {
        chooseImage({}).then(res => {
            console.log('....00: ', res);
            if (res && res.tempFilePaths) {
                personPic = res.tempFilePaths[0];
                return getImageInfo(personPic);
            }
            return Promise.reject();
        }).then(res => {
            console.log('....11: ', res);
            if (res && res.path) {
                let {
                    width,
                    height
                } = res;
                let ratio = width / height;
                if (ratio >= 1) {
                    // 图片过宽，拉伸高度
                    clipWidth = height;
                    positionX = Number((width - height) / 2);
                } else {
                    // 图片过高，拉伸宽度
                    clipWidth = width;
                }
                const ctx = wx.createCanvasContext(canvasId, this);

                // 初始化白色背景
                roundRectColor(ctx, 0, 0, CANVASDATA.width, CANVASDATA.height, 0);

                // 封面图
                ctx.drawImage(res.path, positionX, positionY, clipWidth, clipWidth, 0, 0, initWidth, initHeight);

                // slogan title
                drawText(ctx, SLOGAN);

                // 分享内容描述
                let detailDes = {
                    text: '诚邀你来参加',
                    color: '#898D93',
                    fontStyle: '24px PingFangSC-Regular',
                    positionX: 30,
                    positionY: 652,
                }
                drawText(ctx, detailDes);

                let dashLine = {
                    color: '#979797',
                    width: 1,
                    startPoint: {
                        x: 30,
                        y: 717
                    },
                    endPoint: {
                        x: 530,
                        y: 717
                    }
                }
                drawLine(ctx, dashLine);

                // 分享内容描述
                let bottomDes = {
                    text: '5月14日-晚7点-双下山',
                    color: '#666',
                    fontStyle: '22px PingFangSC-Regular',
                    positionX: 260,
                    positionY: 759,
                }
                drawText(ctx, bottomDes);

                ctx.draw(true, () => {
                    wx.canvasToTempFilePath({
                        canvasId: canvasId,
                        success: res => {
                            wx.hideLoading();
                            success(res.tempFilePath);
                        },
                        fail() {}
                    });
                });
            } else {
                return Promise.reject();
            }
        }).catch(err => {
            console.log('....333: ', err);
            wx.hideLoading();
            wx.showToast({
                title: '生成失败，请稍候再试',
                icon: 'none',
                duration: 2000
            });
            fail();
        });

    });
}