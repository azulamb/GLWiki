var App = (function () {
    function App(id) {
        var _this = this;
        this.params = this.parseGetParam();
        var area = document.getElementById(id);
        if (!area) {
            return;
        }
        this.area = area;
        this.loadPage(this.page).then(function (md) { _this.renderPage(md); });
    }
    App.prototype.parseGetParam = function () {
        var _this = this;
        this.page = '';
        var query = location.search.substring(1);
        if (!query) {
            return {};
        }
        var params = {};
        query.split('&').forEach(function (kv, i) {
            var _a = kv.split('=', 2), key = _a[0], value = _a[1];
            if (i === 0 && value === undefined) {
                _this.page = key;
                return;
            }
            if (!key) {
                return;
            }
            params[key] = decodeURIComponent(value || '');
        });
        return params;
    };
    App.prototype.loadPage = function (path) {
        if (!path || path.match(/\/$/)) {
            path += 'index';
        }
        return fetch(path + '.md').then(function (result) {
            return result.text();
        }).catch(function (error) {
            return "<div class=\"error\">\n# Error\n\n" + path + " is notfound.\n\n</div>";
        });
    };
    App.prototype.renderPage = function (md) {
        var title = this.getTitle(md);
        if (title) {
            this.setTitle(title);
        }
        this.area.innerHTML = marked(md);
    };
    App.prototype.getTitle = function (md) {
        var m = md.match(/\# ([^\n]+)/);
        if (!m) {
            return '';
        }
        return m[0];
    };
    App.prototype.setTitle = function (title) {
        document.title = [title, document.title].join(' - ');
    };
    return App;
}());
document.addEventListener('DOMContentLoaded', function () {
    new App('content');
});
