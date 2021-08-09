import type { GenerateConfig } from '../../vc-picker/generate/index';
import type {
  PickerBaseProps as RCPickerBaseProps,
  PickerDateProps as RCPickerDateProps,
  PickerTimeProps as RCPickerTimeProps,
} from '../../vc-picker/Picker';
import type { SharedTimeProps } from '../../vc-picker/panels/TimePanel';
import type {
  RangePickerBaseProps as RCRangePickerBaseProps,
  RangePickerDateProps as RCRangePickerDateProps,
  RangePickerTimeProps as RCRangePickerTimeProps,
} from '../../vc-picker/RangePicker';
import type { PickerMode, Locale as RcPickerLocale } from '../../vc-picker/interface';
import PickerButton from '../PickerButton';
import PickerTag from '../PickerTag';
import type { TimePickerLocale } from '../../time-picker';
import generateSinglePicker from './generateSinglePicker';
import generateRangePicker from './generateRangePicker';
import type { SizeType } from '../../config-provider';
import type { ExtraDatePickerProps, ExtraRangePickerProps } from './props';
import type { DefineComponent } from 'vue';

export const Components = { button: PickerButton, rangeItem: PickerTag };

function toArray<T>(list: T | T[]): T[] {
  if (!list) {
    return [];
  }
  return Array.isArray(list) ? list : [list];
}

export function getTimeProps<DateType>(
  props: { format?: string; picker?: PickerMode } & SharedTimeProps<DateType>,
) {
  const { format, picker, showHour, showMinute, showSecond, use12Hours } = props;

  const firstFormat = toArray(format)[0];
  const showTimeObj: SharedTimeProps<DateType> = { ...props };

  if (firstFormat && typeof firstFormat === 'string') {
    if (!firstFormat.includes('s') && showSecond === undefined) {
      showTimeObj.showSecond = false;
    }
    if (!firstFormat.includes('m') && showMinute === undefined) {
      showTimeObj.showMinute = false;
    }
    if (!firstFormat.includes('H') && !firstFormat.includes('h') && showHour === undefined) {
      showTimeObj.showHour = false;
    }

    if ((firstFormat.includes('a') || firstFormat.includes('A')) && use12Hours === undefined) {
      showTimeObj.use12Hours = true;
    }
  }

  if (picker === 'time') {
    return showTimeObj;
  }

  if (typeof firstFormat === 'function') {
    // format of showTime should use default when format is custom format function
    delete showTimeObj.format;
  }

  return {
    showTime: showTimeObj,
  };
}

type InjectDefaultProps<Props> = Omit<
  Props,
  | 'locale'
  | 'generateConfig'
  | 'prevIcon'
  | 'nextIcon'
  | 'superPrevIcon'
  | 'superNextIcon'
  | 'hideHeader'
  | 'components'
> & {
  locale?: PickerLocale;
  size?: SizeType;
  bordered?: boolean;
};

export type PickerLocale = {
  lang: RcPickerLocale & AdditionalPickerLocaleLangProps;
  timePickerLocale: TimePickerLocale;
} & AdditionalPickerLocaleProps;

export type AdditionalPickerLocaleProps = {
  dateFormat?: string;
  dateTimeFormat?: string;
  weekFormat?: string;
  monthFormat?: string;
};

export type AdditionalPickerLocaleLangProps = {
  placeholder: string;
  yearPlaceholder?: string;
  quarterPlaceholder?: string;
  monthPlaceholder?: string;
  weekPlaceholder?: string;
  rangeYearPlaceholder?: [string, string];
  rangeMonthPlaceholder?: [string, string];
  rangeWeekPlaceholder?: [string, string];
  rangePlaceholder?: [string, string];
};

// Picker Props
export type PickerBaseProps<DateType> = InjectDefaultProps<RCPickerBaseProps<DateType>>;
export type PickerDateProps<DateType> = InjectDefaultProps<RCPickerDateProps<DateType>>;
export type PickerTimeProps<DateType> = InjectDefaultProps<RCPickerTimeProps<DateType>>;

export type PickerProps<DateType> =
  | PickerBaseProps<DateType>
  | PickerDateProps<DateType>
  | PickerTimeProps<DateType>;

// Range Picker Props
export type RangePickerBaseProps<DateType> = InjectDefaultProps<RCRangePickerBaseProps<DateType>>;
export type RangePickerDateProps<DateType> = InjectDefaultProps<RCRangePickerDateProps<DateType>>;
export type RangePickerTimeProps<DateType> = InjectDefaultProps<RCRangePickerTimeProps<DateType>>;

export type RangePickerProps<DateType> =
  | RangePickerBaseProps<DateType>
  | RangePickerDateProps<DateType>
  | RangePickerTimeProps<DateType>;

function generatePicker<DateType>(
  generateConfig: GenerateConfig<DateType>,
  extraProps: Record<string, any> = {},
) {
  type DatePickerProps = PickerProps<DateType> & ExtraDatePickerProps<DateType>;
  // =========================== Picker ===========================
  const { DatePicker, WeekPicker, MonthPicker, YearPicker, TimePicker, QuarterPicker } =
    generateSinglePicker<DateType>(generateConfig, extraProps);

  // ======================== Range Picker ========================
  const RangePicker = generateRangePicker<DateType>(generateConfig, extraProps);

  // 类型过于复杂，使用 as 避免 TS7056 错误
  // error TS7056: The inferred type of this node exceeds the maximum length the compiler will serialize. An explicit type annotation is needed.
  return {
    DatePicker,
    WeekPicker,
    MonthPicker,
    YearPicker,
    TimePicker,
    QuarterPicker,
    RangePicker,
  } as unknown as {
    DatePicker: DefineComponent<DatePickerProps>;
    WeekPicker: DefineComponent<Omit<PickerDateProps<DateType>, 'picker'>>;
    MonthPicker: DefineComponent<Omit<PickerDateProps<DateType>, 'picker'>>;
    YearPicker: DefineComponent<Omit<PickerDateProps<DateType>, 'picker'>>;
    TimePicker: DefineComponent<Omit<PickerTimeProps<DateType>, 'picker'>>;
    QuarterPicker: DefineComponent<Omit<PickerTimeProps<DateType>, 'picker'>>;
    RangePicker: DefineComponent<RangePickerProps<DateType> & ExtraRangePickerProps<DateType>>;
  };
}

export default generatePicker;
