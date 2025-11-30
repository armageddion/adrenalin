      BEGIN { p=0; in_string=0; buffer="" }
   /^INSERT/ { p=1; in_string=0; buffer="" }
   p {
     buffer = buffer $0 "\n"
     len = length($0)
     for (i=1; i<=len; i++) {
       c = substr($0, i, 1)
       if (c == "'") {
         if (i < len && substr($0, i+1, 1) == "'") {
           i++
         } else {
           in_string = !in_string
         }
       }
     }
     if (!in_string && /;$/) {
       print buffer
       p=0
       buffer=""
     }
   }