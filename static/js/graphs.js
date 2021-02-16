queue()
  .defer(d3.json, '/donorschoose/projects')
  .defer(d3.json, 'static/geojson/us-states.json')
  .await(makeGraphs)

function makeGraphs (error, projectsJson, statesJson) {
  // Clean projectsJson data
  const donorschooseProjects = projectsJson
  const dateFormat = d3.time.format('%m/%d/%Y %H:%M')
  donorschooseProjects.forEach(function (d) {
    const parsedDate = dateFormat.parse(d.date_posted)
    if (parsedDate) {
      d.date_posted = parsedDate
      d.date_posted.setDate(1)
      d.total_donations = +d.total_donations
    } else {
      console.warn(`Failed to parse date ${d.date_posted} (Result: ${parsedDate})`)
    }
  })

  // Create a Crossfilter instance
  const ndx = crossfilter(donorschooseProjects)

  // Define Dimensions
  const dateDim = ndx.dimension(function (d) { return d.date_posted })
  const resourceTypeDim = ndx.dimension(function (d) { return d.resource_type })
  const povertyLevelDim = ndx.dimension(function (d) { return d.poverty_level })
  const stateDim = ndx.dimension(function (d) { return d.school_state })
  const totalDonationsDim = ndx.dimension(function (d) { return d.total_donations })

  // Calculate metrics
  const numProjectsByDate = dateDim.group()
  const numProjectsByResourceType = resourceTypeDim.group()
  const numProjectsByPovertyLevel = povertyLevelDim.group()
  const totalDonationsByState = stateDim.group().reduceSum(function (d) {
    return d.total_donations
  })

  const all = ndx.groupAll()
  const totalDonations = ndx.groupAll().reduceSum(function (d) { return d.total_donations })

  const max_state = totalDonationsByState.top(1)[0].value

  // Define values (to be used in charts)
  const minDate = dateDim.bottom(1)[0].date_posted
  const maxDate = dateDim.top(1)[0].date_posted

  // Charts
  const timeChart = dc.barChart('#time-chart')
  const resourceTypeChart = dc.rowChart('#resource-type-row-chart')
  const povertyLevelChart = dc.rowChart('#poverty-level-row-chart')
  const usChart = dc.geoChoroplethChart('#us-chart')
  const numberProjectsND = dc.numberDisplay('#number-projects-nd')
  const totalDonationsND = dc.numberDisplay('#total-donations-nd')

  numberProjectsND
    .formatNumber(d3.format('d'))
    .valueAccessor(function (d) { return d })
    .group(all)

  totalDonationsND
    .formatNumber(d3.format('d'))
    .valueAccessor(function (d) { return d })
    .group(totalDonations)
    .formatNumber(d3.format('.3s'))

  timeChart
    .width(600)
    .height(160)
    .margins({ top: 10, right: 50, bottom: 30, left: 50 })
    .dimension(dateDim)
    .group(numProjectsByDate)
    .transitionDuration(500)
    .x(d3.time.scale().domain([minDate, maxDate]))
    .elasticY(true)
    .xAxisLabel('Year')
    .yAxis().ticks(4)

  resourceTypeChart
    .width(300)
    .height(250)
    .dimension(resourceTypeDim)
    .group(numProjectsByResourceType)
    .xAxis().ticks(4)

  povertyLevelChart
    .width(300)
    .height(250)
    .dimension(povertyLevelDim)
    .group(numProjectsByPovertyLevel)
    .xAxis().ticks(4)

  usChart.width(1000)
    .height(330)
    .dimension(stateDim)
    .group(totalDonationsByState)
    .colors(['#E2F2FF', '#C4E4FF', '#9ED2FF', '#81C5FF', '#6BBAFF', '#51AEFF', '#36A2FF', '#1E96FF', '#0089FF', '#0061B5'])
    .colorDomain([0, max_state])
    .overlayGeoJson(statesJson.features, 'state', function (d) {
      return d.properties.name
    })
    .projection(d3.geo.albersUsa()
      .scale(600)
      .translate([340, 150]))
    .title(function (p) {
      return 'State: ' + p.key +
          '\n' +
          'Total Donations: ' + Math.round(p.value) + ' $'
    })

  dc.renderAll()
};
