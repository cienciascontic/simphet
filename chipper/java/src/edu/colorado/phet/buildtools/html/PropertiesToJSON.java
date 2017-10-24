// Copyright 2002-2014, University of Colorado Boulder

package edu.colorado.phet.buildtools.html;

import java.io.File;
import java.io.FileInputStream;
import java.io.FilenameFilter;
import java.io.IOException;
import java.util.Properties;

/**
 * Converts localized string files from .properties to .json format.
 * Usage:
 * args[0] is the source localization directory in a Java project, such as "C:\workingcopy\phet\svn-1.7\trunk\simulations-java\simulations\energy-skate-park\data\energy-skate-park\localization"
 * args[1] is the destination localization directory in an HTML5 project, such as "C:\workingcopy\phet\svn-1.7\trunk\simulations-html5\simulations\energy-skate-park\strings"
 * args[2] (optional) is a 'filter', and only strings whose key contains the filter are converted, non-matching key/value pairs are omitted.
 *
 * @author Sam Reid
 */
public class PropertiesToJSON {
    public static void main( final String[] args ) throws IOException {

        //Check program arguments
        if ( args.length < 2 ) {
            System.out.println( "not enough program arguments, see usage in source code documentation" );
            System.exit( 1 );
        }

        //Source is the localization directory, such as "C:\workingcopy\phet\svn-1.7\trunk\simulations-java\simulations\energy-skate-park\data\energy-skate-park\localization"
        File source = new File( args[0] );

        //Destination is the target nls root, such as "C:\workingcopy\phet\svn-1.7\trunk\simulations-html5\simulations\energy-skate-park\strings"
        File destination = new File( args[1] );

        //Filter param
        System.out.println("args length = " + args.length );
        String filter = null;
        if ( args.length > 2 ){
            filter = args[2];
        }

        //Get all properties files that contain localized strings
        File[] files = source.listFiles( new FilenameFilter() {
            public boolean accept( final File dir, final String name ) {
                return name.endsWith( ".properties" ) && name.contains( "-strings" );
            }
        } );

        //Convert each properties file to a JSON file
        for ( final File file : files ) {

            // English strings file has no locale identifier in its name
            final boolean english = file.getName().indexOf( '_' ) < 0;

            Properties p = new Properties() {{
                load( new FileInputStream( file ) );
            }};

            String output = "{\n";

            //Convert each property to a substring of the form: "key": "value"
            for ( Object key : p.keySet() ) {
                if ( filter == null || key.toString().contains( filter ) ){
                    String prefix = "    \"";
                    output += prefix + key + "\": \"" + escape( p.get( key ).toString() ) + "\",\n";
                }
            }

            //Remove the last comma
            int lastCommaIndex = output.lastIndexOf( ',' );
            if ( lastCommaIndex != -1 ){
                output = output.substring( 0, lastCommaIndex ) + output.substring( lastCommaIndex + 1 );
            }

            output += "}";

            System.out.println( output );
            System.out.println();
            System.out.println();
            System.out.println();

            //Get the locale from the properties filename.
            final String tail = file.getName().substring( file.getName().indexOf( "_" ) + 1 );
            String localeAndCountry = english ? "en" : tail.substring( 0, tail.indexOf( '.' ) );

            //General form of the output filename is <project>-strings_locale.json, eg color-vision-strings_fr.json
            String a = file.getName().substring( 0, file.getName().indexOf( "-strings" ) );
            String filename = a + "-strings_" + localeAndCountry + ".json";

            FileUtils.writeString( new File( destination, filename ), output );
        }
    }

    private static String escape( final String s ) {
        //Replace " with \".  May need to add other escapes later on.
        return s.replace( "\"", "\\\"" ).replace( "\n", "\\n" );
    }
}