(function(){

    // Default Theme
    // -------------

    dw.theme.register('default', {

        colors: {
            // primary colors
			// Original palette:
			/*
            palette: [
            	"#1f77b4", // Blue
            	"#ff7f0e", // Orange
            	"#2ca02c", // Green
            	"#d62728", // Red
            	"#9467bd"  // Purple
            	],
			*/
            palette: [
				// Colors decided by Femme, but based upon research of SRON's technical note (SRON/EPS/TN/09-002)
				"#98bc1c", // Groen
				"#0cab92", // Turqoise
				"#8be0eb", // Lichtblauw
				"#1f66bb", // Donkerblauw
				"#ede56a", // Geel
				"#bd733b", // Bruin
				"#b576a1", // Paars
				"#b81b3b", // Rood
				"#f9aa68", // Zalm
				"#c5c8c8", // Grijs
			],
            // secondary colors, used in custom color dialog
            // this should contain colors that might be useful
            secondary: ["#000000", '#777777', '#cccccc', '#ffd500', '#6FAA12'],
            context: '#aaa',
            axis: '#000000',
            positive: '#1f77b4',
            negative: '#d62728',
            background: '#ffffff'
        },

        lineChart: {
            fillOpacity: 0.2
        },

        vpadding: 10,

        frame: false,

        verticalGrid: false,

        columnChart: {
            darkenStroke: 5
        }

    });

}).call(this);