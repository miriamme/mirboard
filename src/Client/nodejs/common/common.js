module.exports = {
    //현재날짜 가저오기 : return value (yyyy-MM-dd HH:mm:ss)
    getDate: function() {
        var date;
        date = new Date();
        date = date.getFullYear() + '-' +
            ('00' + (date.getMonth() + 1)).slice(-2) + '-' +
            ('00' + date.getDate()).slice(-2) + ' ' +
            ('00' + date.getHours()).slice(-2) + ':' +
            ('00' + date.getMinutes()).slice(-2) + ':' +
            ('00' + date.getSeconds()).slice(-2);
        return date;
    },

    //페이징 구성하기
    ///totalRowCount : 전체데이터 개수
    ///pageRowSize   : 한페이지에 뿌려질 데이터 개수
    ///currentPageNo : 현재 페이지 번호(1부터 시작)
    ///pageRawPath   : 파라메터를 포함하는 페이지경로(page.aspx?a=1)
    ///pageQryName   : 페이지번호를 인식하는 쿼리스트링 이름(p | page | etc)
    pagination: function(totalRowCount, pageRowSize, currentPageNo, pageRawPath, pageQryName) {
        var rowCnt = parseInt(totalRowCount); //전체데이터 개수
        var rowSize = parseInt(pageRowSize); //한페이지에 뿌려질 데이터 개수
        var totalPageCnt = 0; //페이징번호로 표현할 수 있는 최대값
        currentPageNo = parseInt(currentPageNo);

        if (rowCnt % rowSize > 0)
            totalPageCnt = parseInt(rowCnt / rowSize) + 1;
        else
            totalPageCnt = parseInt(rowCnt / rowSize);

        //현재페이지번호 표현식
        var activeLink = "<li class='page-item active'> <a class='page-link' href='#'>" + currentPageNo + "</a></li>";

        //"다음"페이지 표현식
        var nextLink = "";
        if (totalPageCnt > currentPageNo)
            nextLink = "<li class='page-item'> <a href='" + this.getQueryStringExchange(pageRawPath, pageQryName, currentPageNo + 1) + "' class='page-link' title='" + (currentPageNo + 1) + " 페이지'>Next</a></li>";
        else
            nextLink = "<li class='page-item disabled'> <a class='page-link' href='#' tabindex='-1'>Next</a> </li>";

        var sb = "";

        sb += "<div id='paging' class='container'>";
        sb += "<nav aria-label='Page navigation example'>";
        sb += "<ul class='pagination justify-content-end'>";

        if (currentPageNo - 2 > 0) {
            sb += "<li class='page-item'> <a class='page-link' href='" + this.getQueryStringExchange(pageRawPath, pageQryName, "1") + "'>1</a></li>";
            sb += "<li class='page-item disabled'><a class='page-link' href='#' tabindex='-1'>...</a></li>";
            sb += "<li class='page-item'> <a class='page-link' href='" + this.getQueryStringExchange(pageRawPath, pageQryName, currentPageNo - 1) + "'>" + (currentPageNo - 1) + "</a></li>";
            sb += activeLink;
        } else if (currentPageNo - 1 > 0) {
            sb += "<li class='page-item'> <a class='page-link' href='" + this.getQueryStringExchange(pageRawPath, pageQryName, currentPageNo - 1) + "'>" + (currentPageNo - 1) + "</a></li>";
            sb += activeLink;
        } else {
            sb += activeLink;
        }

        if (totalPageCnt >= currentPageNo + 1) {
            sb += "<li class='page-item'> <a class='page-link' href='" + this.getQueryStringExchange(pageRawPath, pageQryName, currentPageNo + 1) + "'>" + (currentPageNo + 1) + "</a></li>";
            sb += "<li class='page-item disabled'><a class='page-link' href='#' tabindex='-1'>...</a></li>";
            sb += nextLink;
        } else {
            sb += nextLink;
        }

        sb += "</div>";
        sb += "</div>";
        sb += "</div>";

        return sb;
    },

    //지정된 QueryString Parameters 값 바꾸기
    getQueryStringExchange: function(pathRaw, queryName, val) {
        // 하나만 값이 없으면 공백 리턴
        if (pathRaw === "") return "";

        // QueryString에 대한 Parameter가 하나도 없으면 공백 리턴
        if (pathRaw.indexOf('?') === -1) {
            if (queryName === "" || val === "") return "";
            else return pathRaw + "?" + queryName + "=" + val;
        }

        var paths = pathRaw.split('?');

        // 상대경로
        var path = paths[0];

        // QuerySttring Array splited
        var querys = paths[1].split('&');
        // QueryString 조합문자열
        var combinedQry = "";
        // 만약 queryName의 값이 없을 경우 새로 추가해준다.
        var isExist = false;

        for (var i = 0; i < querys.length; i++) {
            let qryUnits = querys[i].split('=');
            if (qryUnits[0].toLowerCase() === queryName.toLowerCase()) {
                combinedQry += qryUnits[0] + "=" + val + "&";
                isExist = true;
            } else
                combinedQry += querys[i] + "&";
        }

        if (combinedQry.indexOf('&') > 0) {
            if (isExist)
                combinedQry = combinedQry.substring(0, combinedQry.length - 1);
            else
                combinedQry += queryName + "=" + val;
        }

        return path + "?" + combinedQry;
    }
};