/**
 * 좌측문자열채우기
 * @params
 *  - padLen : 최대 채우고자 하는 길이
 *  - padStr : 채우고자하는 문자(char)
 */
export class CursorFunction {
  lpad(val: string, padLength: number, padString: string) {

    if (padString.length > padLength || val.length > padLength) {
      throw new Error('커서 문자열 길이보다 파라미터 길이가 커요');
    }
    for(let i= val.length; i<padLength; i++){
        val = ''.concat(padString, val )
    }
    return val
}
}
