/**
 * 一个支持主文字，副文字以及右边有一个链接标志的列表
 *
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { ListView, PullToRefresh } from 'antd-mobile';
import { View, ActivityIndicator, Text, StyleSheet, ScrollView } from 'react-native';
// import { propTypes } from 'yes'; // eslint-disable-line
import { GridRowWrap as gridRowWrap, DynamicControl, GridWrap } from 'yes';
// import styles from '../../style';
import ListViewItem from './ListViewItem';
import ActionButton from './ActionButton';
import { withDetail, ListComponents } from 'yes-comp-react-native-web';

const {
    ListText
} = ListComponents;
class AntdListView extends PureComponent {
    static propTypes = {
        yigoid: PropTypes.string,
        primaryKey: PropTypes.string,
        secondKey: PropTypes.string,
        tertiaryKey: PropTypes.string,
        divider: PropTypes.bool,
        showArrow: PropTypes.bool,
    };
    // static contextTypes = {
    //     uiTheme: PropTypes.object.isRequired,
    // };
    static defaultProps = {
        // ...ImmutableVirtulized.defaultProps,
        style: {},
        showArrow: true,
        divider: true,
    };

    static contextTypes = {
        createElement: PropTypes.func,
    }
    componentWillReceiveProps(nextProps) {
        const data = nextProps.controlState.getIn(['dataModel', 'data']);
        if (data) {
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(nextProps.controlState.getIn(['dataModel', 'data']), this.generateRowIdentifier(nextProps)),
            });
        }
    }

    componentWillMount() {
        if (this.props.controlState && this.props.controlState.getIn(['dataModel', 'data'])) {
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(this.props.controlState.getIn(['dataModel', 'data']),
                    this.generateRowIdentifier(this.props)),
            });
        }
    }

    generateRowIdentifier = (props) => {
        const data = props.controlState.getIn(['dataModel', 'data']);
        const result = [];
        for (let i = 0; i < data.size; i++) {
            result.push(i);
        }
        return result;
    }

    state = {
        dataSource: new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
            getRowData: (dataBlob, sectionIndex, rowIndex) => {
                return dataBlob[sectionIndex].get(rowIndex);
            },
        }),
    }

    onClick = (rowIndex) => {
        if (this.props.onClick) {
            this.props.onClick(rowIndex);
        }
    }
    generateTertiaryElement = () => {
        const el = [];
        if (this.props.tertiaryKey) {
            this.props.tertiaryKey.forEach((item) => {
                let itemtype = typeof item;
                if (itemtype === 'string') {
                    el.push(<ListText yigoid={item} />);
                } else {
                    if (item.$$typeof) {
                        el.push(item);
                    } else {
                        el.push(<ListText {...item} />);
                    }
                }
            });
            return <View style={{ flexDirection: 'row' }}>{el}</View>;
        }
        return null;
    }
    generatePrimaryELement = () => {
        const primaryKey = this.props.primaryKey;
        let el;
        if (!primaryKey) {
            return null;
        }
        const itemtype = typeof (primaryKey);
        if (itemtype === 'string') {
            el = <ListText style={[styles.primaryText]} yigoid={primaryKey} />;
        } else {
            if (primaryKey.$$typeof) {
                el = primaryKey;
            } else {
                el = <ListText style={[styles.primaryText]} {...primaryKey} />;
            }
        }
        return <View style={[{ flexDirection: 'row' }, this.props.style.firstline]}>{el}</View>;
    }
    generateSecondaryElement = () => {
        const el = [];
        if (this.props.secondKey) {
            this.props.secondKey.forEach((item) => {
                let itemtype = typeof item;
                if (itemtype === 'string') {
                    el.push(<ListText style={[styles.secondaryText]} key={item} yigoid={item} />);
                } else {
                    if (item.$$typeof) {
                        el.push(item);
                    } else {
                        el.push(<ListText style={[styles.secondaryText]} {...item} />);
                    }
                }
            });
            return <View style={{ flexDirection: 'row' }}>{el}</View>;
        }
        return null;
    }
    generateActions = () => (
        <View style={[styles.flexrow_r, this.props.actionContainerStyle]}>
            {
                this.props.actions.map((action) => {
                    const itemType = typeof (action);
                    if (itemType === 'string') {
                        return <DynamicControl yigoid={action} />;
                    }
                    if (itemType.$$typeof) {
                        return action;
                    }
                    return <DynamicControl {...action} />;
                })
            }
        </View>
    );

    centerComp = (
        <View style={[{ flex: 1 }, this.props.style.centerStyle]}>
            {this.generatePrimaryELement()}
            {this.generateSecondaryElement()}
            {this.generateTertiaryElement()}
        </View>
    )
    NewListItem = gridRowWrap(ListViewItem, ActivityIndicator, this.props.yigoid)
    // RowView = listRowWrap(View, this.props.yigoid)
    renderItem = (item, secionId, rowId, highlightRow) => {
        const NewListItem = this.NewListItem;
        return (
            <NewListItem
                centerElement={this.centerComp}
                rightElement={this.context.createElement(this.props.rightElement)}
                containerStyle={this.props.rowStyle}
                onPress={() => this.onClick(rowId)}
                // divider={this.props.divider}
                rowIndex={rowId}
                showArrow={this.props.showArrow}
                leftElement={this.context.createElement(this.props.leftElement)}
            />
        );
    }
    onRefresh = () => {
        this.props.onRefresh && this.props.onRefresh();
    }
    addRow = () => {
        this.props.addNewRow && this.props.addNewRow();
    }
    render() {
        const { layoutStyles, style, isVirtual, showHead, headTitle, headExtra, editable } = this.props;
        const extra = headExtra? this.context.createElement(headExtra) : null;
        if (isVirtual) {
            return (
                <View style={[layoutStyles]}>
                    <ActivityIndicator size="large" color="cadetblue" />
                </View>
            );
        }
        return (
            <View style={[layoutStyles, styles.container]}>
                {
                    showHead ?
                        <View style={[styles.head]}>
                            <Text style={[styles.headTitle]}>{headTitle}</Text>
                            <View>
                            {extra}
                            </View>
                        </View> : null
                }
                <View style={{ flex: 1 }}>
                    <ListView
                        style={{flex:1}}
                        initialListSize={20}
                        dataSource={this.state.dataSource}
                        renderRow={this.renderItem}
                        pageSize={4}
                    />
                    {
                        editable ? <ActionButton onPress={this.addRow} /> : null
                    }
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        flex: 1,
    },
    head: {
        flexDirection: 'row',
        paddingLeft: 12,
    },
    headTitle: {
        paddingTop:8,
        paddingBottom: 8,
        flex:1,
        opacity: '80%',
    },
    list: {
        flex:1,
    },
    primaryText: {
        paddingTop: 8,
        paddingLeft: 4,
    },
    secondaryText: {
        paddingTop: 4,
        paddingLeft:6,
        paddingBottom: 4,
        opacity: '60%',
        fontSize: 12,
    }
})

export default GridWrap(withDetail(AntdListView));
