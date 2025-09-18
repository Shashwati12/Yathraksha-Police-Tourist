// North-East states
export const statesNE = ['Arunachal Pradesh','Assam','Manipur','Meghalaya','Mizoram','Nagaland','Tripura','Sikkim'];

export const tourists = [
  { id:'T-1001', name:'Riya Sen', phone:'+91-9812345678', passport:'N1234****', aadhaar:'**** 1234', last4:'1234', state:'Sikkim', district:'Gangtok', pincode:'737101', lat:27.3314, lng:88.6138, groupSize:3, itinerary:['MG Marg','Tsomgo Lake','Nathula'], panic:true, dropOffMins:10, lastSeen:'MG Marg', sosId:'A-9001' },
  { id:'T-1002', name:'Arun Mehta', phone:'+91-9820098765', passport:'Z7788****', aadhaar:'**** 7788', last4:'7788', state:'Assam', district:'Kamrup Metro', pincode:'781001', lat:26.1445, lng:91.7362, groupSize:2, itinerary:['Guwahati','Umananda','Kaziranga'], panic:false, dropOffMins:130, lastSeen:'Paltan Bazaar', sosId:'A-9002' },
  { id:'T-1003', name:'Megha Barman', phone:'+91-7003342211', passport:'P6655****', aadhaar:'**** 6655', last4:'6655', state:'Meghalaya', district:'East Khasi Hills', pincode:'793001', lat:25.5788, lng:91.8933, groupSize:4, itinerary:['Shillong','Cherrapunji'], panic:true, dropOffMins:25, lastSeen:'Police Bazar', sosId:'A-9003' },
  { id:'T-1004', name:'Tashi Dorji', phone:'+91-9862011122', passport:'E5522****', aadhaar:'**** 5522', last4:'5522', state:'Arunachal Pradesh', district:'Tawang', pincode:'790104', lat:27.5860, lng:91.8668, groupSize:5, itinerary:['Tawang Monastery','Sela Pass'], panic:false, dropOffMins:15, lastSeen:'Tawang Monastery', sosId:null },
  { id:'T-1005', name:'Ananya Rao', phone:'+91-9890099900', passport:'R4411****', aadhaar:'**** 4411', last4:'4411', state:'Nagaland', district:'Kohima', pincode:'797001', lat:25.6751, lng:94.1086, groupSize:2, itinerary:['Kohima','Dzükou'], panic:false, dropOffMins:480, lastSeen:'Kohima Museum', sosId:null },
  { id:'T-1006', name:'Kabir Khan', phone:'+91-9123451111', passport:'L2222****', aadhaar:'**** 2222', last4:'2222', state:'Tripura', district:'West Tripura', pincode:'799001', lat:23.8315, lng:91.2868, groupSize:1, itinerary:['Agartala','Ujjayanta'], panic:true, dropOffMins:5, lastSeen:'Agartala Palace', sosId:'A-9004' },
];

export const geo = {
  highRiskZones: [
    { id:'Z-1', name:'Landslide Zone', coords:[[25.55,91.85],[25.57,91.89],[25.59,91.86]], level:'high' },
    { id:'Z-2', name:'Restricted Border Area', coords:[[27.58,91.84],[27.60,91.88],[27.62,91.86]], level:'medium' },
  ],
  clusterHeat: [
    [25.5788,91.8933,0.7], [27.3314,88.6138,0.6], [26.1445,91.7362,0.8], [25.6751,94.1086,0.5], [23.8315,91.2868,0.4],
  ],
  units: {
    ambulances: [
      { id:'AMB-01', lat:25.58, lng:91.90, status:'available' },
      { id:'AMB-02', lat:26.14, lng:91.74, status:'enroute' },
      { id:'AMB-03', lat:27.33, lng:88.62, status:'available' },
    ],
    police: [
      { id:'PCR-11', lat:27.33, lng:88.62, status:'patrol' },
      { id:'PCR-12', lat:25.58, lng:91.89, status:'standby' },
      { id:'PCR-13', lat:26.15, lng:91.74, status:'patrol' },
    ],
  }
};

export const alerts = [
  { id:'A-9001', type:'SOS', severity:'high', touristId:'T-1001', state:'Sikkim',   district:'Gangtok',        ts:'2025-09-17T01:10:00+05:30', status:'active', reason:'Panic pressed near MG Marg' },
  { id:'A-9002', type:'Drop-Off', severity:'medium', touristId:'T-1002', state:'Assam',    district:'Kamrup Metro', ts:'2025-09-16T22:45:00+05:30', status:'active', reason:'No location update > 2 hrs' },
  { id:'A-9003', type:'SOS', severity:'high', touristId:'T-1003', state:'Meghalaya',district:'East Khasi Hills', ts:'2025-09-17T00:55:00+05:30', status:'active', reason:'SOS triggered at Police Bazar' },
  { id:'A-9004', type:'SOS', severity:'high', touristId:'T-1006', state:'Tripura', district:'West Tripura',   ts:'2025-09-17T01:20:00+05:30', status:'active', reason:'Panic pressed near Palace' },
];

export const dispatchLogs = [
  { id:'D-7001', alertId:'A-9003', unit:'AMB-02', state:'Meghalaya', district:'East Khasi Hills', etaMins:12, status:'enroute',    ts:'2025-09-17T01:05:00+05:30' },
  { id:'D-7002', alertId:'A-9001', unit:'PCR-11', state:'Sikkim',    district:'Gangtok',          etaMins:6,  status:'dispatched', ts:'2025-09-17T01:12:00+05:30' },
  { id:'D-7003', alertId:'A-9002', unit:'AMB-01', state:'Assam',     district:'Kamrup Metro',     etaMins:14, status:'enroute',    ts:'2025-09-16T23:00:00+05:30' },
];

export const firs = [
  { id:'FIR-2025-0001', alertId:'A-8123', officer:'INS-7765 (Kamrup)', sections:['IPC 323','IPC 506'], status:'submitted', ts:'2025-09-12T14:12:00+05:30', state:'Assam', district:'Kamrup' },
  { id:'FIR-2025-0002', alertId:'A-9001', officer:'INS-5521 (Gangtok)', sections:['IPC 363'], status:'submitted', ts:'2025-09-17T01:30:00+05:30', state:'Sikkim', district:'Gangtok' },
];

export const kpis = {
  police:  { activeAlerts: alerts.length, efirsToday: 2, avgResponseMins: 9, sosThisWeek: 11 },
  tourism: { activeAlerts: alerts.length, emergencyReveals: 2, resolutionRate: 0.86, dropOffs: 7 },
};

export const reportSeries = {
  alertsDaily: [
    { day:'Mon', sos:2, drop:1 },{ day:'Tue', sos:3, drop:2 },{ day:'Wed', sos:4, drop:1 },{ day:'Thu', sos:1, drop:2 },{ day:'Fri', sos:5, drop:3 },{ day:'Sat', sos:3, drop:2 },{ day:'Sun', sos:2, drop:1 },
  ],
  firTrend: [
    { month:'Apr', count:8 },{ month:'May', count:12 },{ month:'Jun', count:15 },{ month:'Jul', count:11 },{ month:'Aug', count:18 },{ month:'Sep', count:9 },
  ],
  dispatchTimes: [
    { day:'Mon', eta:12 },{ day:'Tue', eta:10 },{ day:'Wed', eta:9 },{ day:'Thu', eta:11 },{ day:'Fri', eta:8 },{ day:'Sat', eta:10 },{ day:'Sun', eta:9 },
  ],
  touristCluster: [
    { state:'Assam', count:32 },{ state:'Sikkim', count:21 },{ state:'Meghalaya', count:27 },{ state:'Nagaland', count:9 },{ state:'Tripura', count:14 },{ state:'Arunachal', count:10 },
  ],
  dropTrends: [
    { day:'Mon', dropOffs:1 },{ day:'Tue', dropOffs:2 },{ day:'Wed', dropOffs:1 },{ day:'Thu', dropOffs:3 },{ day:'Fri', dropOffs:2 },{ day:'Sat', dropOffs:4 },{ day:'Sun', dropOffs:1 },
  ],
  // Tourism with richer stacked categories is fine; dashboards can add dummy categories if needed.
  resolutionBreakdown: [
    { state:'Assam', resolved:18, pending:3 },
    { state:'Sikkim', resolved:12, pending:2 },
    { state:'Meghalaya', resolved:15, pending:4 },
    { state:'Tripura', resolved:9, pending:1 },
  ],
};
