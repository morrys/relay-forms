import * as React from 'react';
import { useFormSetValue } from './index';
import { TextField as TextFieldMUI } from '@material-ui/core';

export type InputDateFieldType = Date | undefined;

const initialValue = new Date();

export const InputDateField: React.FC<any> = ({ fieldKey, placeholder }) => {
    const [{ value, error }, setValue] = useFormSetValue<InputDateFieldType>({
        key: fieldKey,
        initialValue,
    });

    const setValueCallback = React.useCallback(
        (event) => {
            const value = event.target.valueAsDate;
            console.log('value', value);
            setValue(value);
        },
        [setValue],
    );

    return (
        <TextFieldMUI
            margin="normal"
            style={{ width: 330, margin: 10 }}
            id={fieldKey}
            type="date"
            label={placeholder}
            autoFocus
            error={!!error}
            helperText={error ? error : ''}
            value={value!.toISOString().slice(0, 10)}
            InputLabelProps={{
                shrink: true,
            }}
            variant="outlined"
            onChange={setValueCallback}
        />
    );
};
/*
        <LabelInput nameHtml={key} label={label as string}>
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <DatePicker
        label={placeholder}
          inputFormat={FMT}
          value={moment(value, FMT)}
          onChange={setPickerValueCallback}
          renderInput={(params) => (
            <TextField {...params} {...rest} fullWidth error={!!error} />
          )}
        />
      </LocalizationProvider>
    </LabelInput>
      */
