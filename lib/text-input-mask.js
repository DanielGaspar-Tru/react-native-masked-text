import React from 'react'
import { TextInput, Platform } from 'react-native'
import BaseTextComponent from './base-text-component'

export default class TextInputMask extends BaseTextComponent {
    state = {
        value: ""
    }

    componentDidMount() {
      this.setState({value: this.props.value})
    }

    getElement() {
        return this._inputElement
    }

    _onChangeText(text) {
        if (!this._checkText(text)) {
            return
        }

        const { maskedText, rawText } = this.updateValue(text)
        this.setState({ value: maskedText })

        if (this.props.onChangeText) {
            this.props.onChangeText(maskedText, rawText)
        }
    }

    _trySetNativeProps(maskedText) {
        try {
            const element = this.getElement()
            element.setNativeProps && element.setNativeProps({ text: maskedText })
        } catch (error) {
            // silent
        }
    }

    _checkText(text) {
        if (this.props.checkText) {
            return this.props.checkText(this.props.value, text)
        }

        return true
    }

    _getKeyboardType() {
        if (Platform.OS === "web") return
        return this.props.keyboardType || this._maskHandler.getKeyboardType()
    }

    render() {
        let Input = TextInput

        if (this.props.customTextInput) {
            Input = this.props.customTextInput
            customTextInputProps = this.props.customTextInputProps || {}
        }

        return (
            <Input
                keyboardType={this._getKeyboardType()}
                {...this.props}
                onChangeText={text => this._onChangeText(text)}
                value={this.getDisplayValueFor(this.state.value)}
            />
        )
    }
}
