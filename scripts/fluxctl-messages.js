// @module FluxbotTmpl

var Mustache = require("mustache");

// singleWorkloadTmpl is the template for a single member of the list returned by
// `fluxctl list-workloads -o json`
var singleWorkloadTmpl = `
<style type="text/css" media="screen">
.wrapper{
  font-family: Arial, Helvetica, sans-serif;
  color: #333;
}

.meta{
  color: #666;
}
</style>

<div id="list" class="wrapper">
  <h1>{{ID}}</h1>
  <div id="status" class="meta">
    <section>
      <strong>Status:</strong> {{Status}}
    </section>
    <section>
      <strong>Pods Ready:</strong> {{Rollout.Ready}}
    </section>
    <section>
      <strong>Pods Desired:</strong> {{Rollout.Desired}}
    </section>
  </div>

  <h2>Containers</h2>
  <div id="containers" class="primary">
    <ul>
    {{#containers}}
      {{> singleContainer}}
    {{/containers}}
    </ul>
  </div>


  <h2>Automation</h2>
  <div id="automation" class="meta">
    <section>
      <strong>Automated:</strong> {{Automated}}
    </section>
    <section>
      <strong>Locked:</strong> {{Locked}}
    </section>
    <section>
      <strong>Ignore:</strong> {{Ignore}}
    </section>
    <section>
      <strong>Policies:</strong> {{Policies}}
    </section>   
  </div>
</div>
`

var listWorkloadTmpl = `
<div id="msg">
{{#workloads}}
  {{>workload}}
{{/workloads}}
</div>
`

var listContainerTmpl = `<li><strong>{{Name}}:</strong> {{Current.ID}}</li>`

function listWorkloads(workloadList){
    var view = {
      workloads: workloadList
    }

    rendered =  Mustache.render(listWorkloadTmpl, view, {
      workload: singleWorkloadTmpl,
      singleContainer: listContainerTmpl,
    });

    return rendered.replace(/\r?\n|\r/g, "");
};

module.exports = {
  listWorkloads: listWorkloads
}
