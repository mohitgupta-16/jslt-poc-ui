const jsltFunctionString = `
def getValueIfNotNullElseEmpty(value)
    if($value != null) trim($value) else ""

def ifEmptyMakeNull(value)
    if($value == null or trim($value) == "") null else trim($value)

def concat(value1, value2)
      string(getValueIfNotNullElseEmpty($value1)) + string(getValueIfNotNullElseEmpty($value2))

def lookUp(searchKey, lookupName, filterKey, output)
    let query = { $filterKey : $searchKey }
    Lookup($lookupName, $query, $output)

def concatAndLookup(concatValue1, concatValue2, lookupName, filterKey, output)
     let query = { $filterKey : concat($concatValue1, $concatValue2) }
     Lookup($lookupName, $query, $output)

def checkIfEmptyGetDefualtElseSearch(searchKey, defaultValue, lookupName, filterKey, output)
        if($searchKey != null and $searchKey != "")
            let query = { $filterKey : $searchKey }
            Lookup($lookupName, $query, $output)
        else
            $defaultValue


def getLevelOrDecreasing(interestRate)
    if ($interestRate == "14%" or $interestRate == "15%" or $interestRate == "16%")
        "16"
    else "4"

def getEvaluateLoanNature(moratorium)
    if ($moratorium == "" or $moratorium == "0")
        "04"
    else "03"

def getMoritoriumDuration(moratorium)
    if ($moratorium == "" or $moratorium == "0")
        $moratorium
    else if (number($moratorium) > 0 and number($moratorium) <= 4)
        string(number($moratorium) * 12)
    else "NA"

def evaluateIsInterestPaidDuringMoritorium(moratorium)
    if (number($moratorium) > 0 and number($moratorium) <= 4)
        "N"
    else ""

def getPartnerProduct(product)
    if ($product == "") $product
    else if ($product == "HDFC_LIFE" or $product == "HDFC_LIFE_BASE_CI") $product
    else "NA"

let result =
`;

export default jsltFunctionString;
