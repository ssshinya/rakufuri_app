// Version
const _version = '3.7'
// OS
const _os = 'm'
// 商品の状態
const _rakumaCondition = [
  { 'id': '5', 'name': '新品、未使用' },
  { 'id': '4', 'name': '未使用に近い' },
  { 'id': '6', 'name': '目立った傷や汚れなし' },
  { 'id': '3', 'name': 'やや傷や汚れあり' },
  { 'id': '2', 'name': '傷や汚れあり' },
  { 'id': '1', 'name': '全体的に状態が悪い' }
]
const _paypayCondition = [
  { 'id': 'NEW', 'name': '未使用' },
  { 'id': 'USED10', 'name': '未使用に近い' },
  { 'id': 'USED20', 'name': '目立った傷や汚れなし' },
  { 'id': 'USED40', 'name': 'やや傷や汚れあり' },
  { 'id': 'USED60', 'name': '傷や汚れあり' }
]
// 配送料負担
const _rakumaShippingPayers = [
  { 'id': '1', 'name': '送料込み(あなたが負担)' },
  { 'id': '2', 'name': '着払い(購入者が負担)' }
]
// 配送方法（出品者負担）
const _shippingMethodsSeller = [
  { 'id': '9', 'name': '未定' },
  { 'id': '15', 'name': 'かんたんラクマパック（ヤマト運輸）' },
  { 'id': '18', 'name': 'かんたんラクマパック（日本郵便）' },
  { 'id': '1', 'name': '普通郵便' },
  { 'id': '4', 'name': 'レターパックライト' },
  { 'id': '3', 'name': 'レターパックプラス' },
  { 'id': '11', 'name': 'クリックポスト' },
  { 'id': '14', 'name': '宅急便コンパクト' },
  { 'id': '2', 'name': 'ゆうパック元払い' },
  { 'id': '6', 'name': 'ヤマト宅急便' },
  { 'id': '17', 'name': 'ゆうパケット' },
  { 'id': '12', 'name': 'ゆうメール元払い' },
  { 'id': '16', 'name': 'スマートレター' }
]
// 配送方法（購入者負担）
const _shippingMethodsBuyer = [
  { 'id': '9', 'name': '未定' },
  { 'id': '8', 'name': 'ゆうパック着払い' },
  { 'id': '6', 'name': 'ヤマト宅急便' },
  { 'id': '17', 'name': 'ゆうパケット' },
  { 'id': '13', 'name': 'ゆうメール着払い' }
]
// 配送方法（PayPay）
const _paypayShippingMethods = [
  { 'id': 'YAMATO', 'name': 'ヤフネコ!パック' },
  { 'id': 'JAPAN_POST', 'name': 'ゆうパケット・ゆうパック（おてがる版）' }
]
// 配送までの日数
const _rakumaShippingDurations = [
  { 'id': '1', 'name': '1～2日で発送' },
  { 'id': '2', 'name': '2～3日で発送' },
  { 'id': '3', 'name': '3～7日で発送' }
]
// 配送までの日数
const _paypayShippingDurations = [
  { 'id': 'ONE_TO_TWO_DAYS', 'name': '1～2日で発送' },
  { 'id': 'TWO_TO_THREE_DAYS', 'name': '2～3日で発送' },
  { 'id': 'THREE_TO_SEVEN_DAYS', 'name': '3～7日で発送' }
]
// 発送元地域
const _rakumaPrefs = [
  { 'id': '1', 'name': '北海道' },
  { 'id': '2', 'name': '青森県' },
  { 'id': '3', 'name': '岩手県' },
  { 'id': '4', 'name': '宮城県' },
  { 'id': '5', 'name': '秋田県' },
  { 'id': '6', 'name': '山形県' },
  { 'id': '7', 'name': '福島県' },
  { 'id': '8', 'name': '茨城県' },
  { 'id': '9', 'name': '栃木県' },
  { 'id': '10', 'name': '群馬県' },
  { 'id': '11', 'name': '埼玉県' },
  { 'id': '12', 'name': '千葉県' },
  { 'id': '13', 'name': '東京都' },
  { 'id': '14', 'name': '神奈川県' },
  { 'id': '15', 'name': '新潟県' },
  { 'id': '16', 'name': '富山県' },
  { 'id': '17', 'name': '石川県' },
  { 'id': '18', 'name': '福井県' },
  { 'id': '19', 'name': '山梨県' },
  { 'id': '20', 'name': '長野県' },
  { 'id': '21', 'name': '岐阜県' },
  { 'id': '22', 'name': '静岡県' },
  { 'id': '23', 'name': '愛知県' },
  { 'id': '24', 'name': '三重県' },
  { 'id': '25', 'name': '滋賀県' },
  { 'id': '26', 'name': '京都府' },
  { 'id': '27', 'name': '大阪府' },
  { 'id': '28', 'name': '兵庫県' },
  { 'id': '29', 'name': '奈良県' },
  { 'id': '30', 'name': '和歌山県' },
  { 'id': '31', 'name': '鳥取県' },
  { 'id': '32', 'name': '島根県' },
  { 'id': '33', 'name': '岡山県' },
  { 'id': '34', 'name': '広島県' },
  { 'id': '35', 'name': '山口県' },
  { 'id': '36', 'name': '徳島県' },
  { 'id': '37', 'name': '香川県' },
  { 'id': '38', 'name': '愛媛県' },
  { 'id': '39', 'name': '高知県' },
  { 'id': '40', 'name': '福岡県' },
  { 'id': '41', 'name': '佐賀県' },
  { 'id': '42', 'name': '長崎県' },
  { 'id': '43', 'name': '熊本県' },
  { 'id': '44', 'name': '大分県' },
  { 'id': '45', 'name': '宮崎県' },
  { 'id': '46', 'name': '鹿児島県' },
  { 'id': '47', 'name': '沖縄県' }
]
const _paypayPrefs = [
  { 'id': 'HOKKAIDO', 'name': '北海道' },
  { 'id': 'AOMORI', 'name': '青森県' },
  { 'id': 'IWATE', 'name': '岩手県' },
  { 'id': 'MIYAGI', 'name': '宮城県' },
  { 'id': 'AKITA', 'name': '秋田県' },
  { 'id': 'YAMAGATA', 'name': '山形県' },
  { 'id': 'FUKUSHIMA', 'name': '福島県' },
  { 'id': 'IBARAKI', 'name': '茨城県' },
  { 'id': 'TOCHIGI', 'name': '栃木県' },
  { 'id': 'GUNMA', 'name': '群馬県' },
  { 'id': 'SAITAMA', 'name': '埼玉県' },
  { 'id': 'CHIBA', 'name': '千葉県' },
  { 'id': 'TOKYO', 'name': '東京都' },
  { 'id': 'KANAGAWA', 'name': '神奈川県' },
  { 'id': 'NIIGATA', 'name': '新潟県' },
  { 'id': 'TOYAMA', 'name': '富山県' },
  { 'id': 'ISHIKAWA', 'name': '石川県' },
  { 'id': 'FUKUI', 'name': '福井県' },
  { 'id': 'YAMANASHI', 'name': '山梨県' },
  { 'id': 'NAGANO', 'name': '長野県' },
  { 'id': 'GIFU', 'name': '岐阜県' },
  { 'id': 'SHIZUOKA', 'name': '静岡県' },
  { 'id': 'AICHI', 'name': '愛知県' },
  { 'id': 'MIE', 'name': '三重県' },
  { 'id': 'SHIGA', 'name': '滋賀県' },
  { 'id': 'KYOTO', 'name': '京都府' },
  { 'id': 'OSAKA', 'name': '大阪府' },
  { 'id': 'HYOGO', 'name': '兵庫県' },
  { 'id': 'NARA', 'name': '奈良県' },
  { 'id': 'WAKAYAMA', 'name': '和歌山県' },
  { 'id': 'TOTTORI', 'name': '鳥取県' },
  { 'id': 'SHIMANE', 'name': '島根県' },
  { 'id': 'OKAYAMA', 'name': '岡山県' },
  { 'id': 'HIROSHIMA', 'name': '広島県' },
  { 'id': 'YAMAGUCHI', 'name': '山口県' },
  { 'id': 'TOKUSHIMA', 'name': '徳島県' },
  { 'id': 'KAGAWA', 'name': '香川県' },
  { 'id': 'EHIME', 'name': '愛媛県' },
  { 'id': 'KOCHI', 'name': '高知県' },
  { 'id': 'FUKUOKA', 'name': '福岡県' },
  { 'id': 'SAGA', 'name': '佐賀県' },
  { 'id': 'NAGASAKI', 'name': '長崎県' },
  { 'id': 'KUMAMOTO', 'name': '熊本県' },
  { 'id': 'OITA', 'name': '大分県' },
  { 'id': 'MIYAZAKI', 'name': '宮崎県' },
  { 'id': 'KAGOSHIMA', 'name': '鹿児島県' },
  { 'id': 'OKINAWA', 'name': '沖縄県' }
]
// 購入申請
const _rakumaRequestRequired = [
  { 'id': '1', 'name': 'あり' },
  { 'id': '0', 'name': 'なし' }
]
// サイズ（ヤマト）
const _yamatoSize = [
  { 'id': 'YAMATO_NEKOPOSU', 'name': 'ヤフネコ!ネコポス（A4サイズ）' , 'price': '195円'},
  { 'id': 'YAMATO_COMPACT', 'name': 'ヤフネコ!宅急便コンパクト' , 'price': '380円' },
  { 'id': 'YAMATO_TAKKYUBIN', 'name': 'ヤフネコ!宅急便（60〜160cm）' , 'price': '700円〜' }
]
// サイズ（JP）
const _jpSize = [
  { 'id': 'JP_YUPACKET', 'name': 'ゆうパケット（おてがる版）' , 'price': '175円'},
  { 'id': 'JP_YOUPACK', 'name': 'ゆうパック（おてがる版）（60-170cm）' , 'price': '700円〜' }
]
// サイズ（JP）
const _postFrom = [
  { 'id': 'SEVEN_ELEVEN', 'name': 'セブンイレブン' },
  { 'id': 'FAMILY_MART', 'name': 'ファミリーマート' },
  { 'id': 'LAWSON', 'name': 'ローソン' },
  { 'id': 'JP', 'name': '郵便局' },
  { 'id': 'YAMATO', 'name': 'ヤマト営業所' }
]
// API Token
const _apiTokenOk = 'OK'
const _apiTokenNg = 'NG'
const _apiTokenNonUser = 'NON_USER'
const _apiTokenDuplication = 'DUPLICATION'
// Const Key
const _constLisenceKey = 'LICENCE_DATE'
const _constAssistantToken = 'ASSISTANT_TOKEN'
const _constInterval = 'INTERVAL'
// URL
const _assistantHost = 'http://www.rakurakufurima.com'

// User Agent
const _rakumaUserAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Fril/9.0.0'
const _paypayUserAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) YJApp-IOS jp.co.yahoo.paypayfleamarket/2.70.0'
const _paypayAppUserAgent = 'YJApp-IOS jp.co.yahoo.paypayfleamarket/2.40.0'
// App version
const _rakumaVersion = '9.0.0'

// paypay
const _paypay_os = 'ios'
const _paypay_os_version = '15.2.1'
const _paypay_app_version = '1.48.0'

export default {
  rakuma_condition: _rakumaCondition,
  paypay_condition: _paypayCondition,
  rakuma_shipping_payers: _rakumaShippingPayers,
  shipping_methods_seller: _shippingMethodsSeller,
  shipping_methods_buyer: _shippingMethodsBuyer,
  paypay_shipping_methods: _paypayShippingMethods,
  rakuma_shipping_durations: _rakumaShippingDurations,
  paypay_shipping_durations: _paypayShippingDurations,
  rakuma_request_required: _rakumaRequestRequired,
  rakuma_prefs: _rakumaPrefs,
  paypay_prefs: _paypayPrefs,
  yamato_size: _yamatoSize,
  jp_size: _jpSize,
  post_from: _postFrom,
  api_token_ok: _apiTokenOk,
  api_token_ng: _apiTokenNg,
  api_token_non_user: _apiTokenNonUser,
  api_token_duplication: _apiTokenDuplication,
  const_lisence_key: _constLisenceKey,
  const_assistant_token: _constAssistantToken,
  const_interval: _constInterval,
  version: _version,
  os: _os,
  assistant_host: _assistantHost,
  rakuma_user_agent: _rakumaUserAgent,
  paypay_user_agent: _paypayUserAgent,
  paypay_app_user_agent: _paypayAppUserAgent,
  paypay_os: _paypay_os,
  paypay_os_version: _paypay_os_version,
  paypay_app_version: _paypay_app_version,
  rakuma_version: _rakumaVersion
}
