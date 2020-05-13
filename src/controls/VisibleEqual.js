/*
 * @Author: gmf
 * @Date:   2016-03-17 09:22:11
 * @Last Modified by:   gmf
 * @Last Modified time: 2017-02-09 09:03:20
 */
import React, { PureComponent } from 'react';
import { ControlWrap } from 'yes-intf';
/**
 * 添加High Order Component
 * 主要为了包装常用的Attribute： visibale editable等
 *
 */
class VisibleEqual extends PureComponent {
    render() {
        if (this.props.value===this.props.targetValue) {
            return (this.props.children);
        }
        return null;
    }
}

export default ControlWrap(VisibleEqual);